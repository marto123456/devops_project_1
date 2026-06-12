// 1. Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 2. Import your original pg pool configuration and the metrics engine
const pool = require("./config/db");
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

// 4. Run your original raw SQL initialization migrations safely
require("./init-db");

// --- API Endpoints ---

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Node.js backend with Raw SQL & Prometheus 🚀",
    });
});

// Create User (Pure raw SQL)
app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `
            INSERT INTO users(name, email)
            VALUES($1, $2)
            RETURNING *
            `,
            [name, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Users (Pure raw SQL)
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. EXPOSE THE METRICS ENDPOINT (For Prometheus Scraper Agent)
app.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Metrics dashboard available at http://localhost:${PORT}/metrics`);
});