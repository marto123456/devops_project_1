// 1. Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 2. Import Prisma client wrapper and Prometheus tracking metrics
const prisma = require("./lib/prisma");
const { client, httpRequestDuration } = require("./metrics");

const app = express();

app.use(cors());
app.use(express.json());

// 3. TELEMETRY MIDDLEWARE: Sits at the absolute top to capture entire request durations
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        // Tracks Method (GET/POST), clean path, and HTTP Status code (200/500/etc)
        httpRequestDuration
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(duration);
    });

    next();
});

// --- API Endpoints ---

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Node.js backend with Prisma & Prometheus 🚀",
    });
});

// Create User (Upgraded to Prisma)
app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
            },
        });
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Users (Upgraded to Prisma)
app.get("/api/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. EXPOSE THE METRICS ENDPOINT (For Prometheus Scraper Agent)
app.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Metrics dashboard available at http://localhost:${PORT}/metrics`);
});