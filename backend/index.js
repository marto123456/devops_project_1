// 1. Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 2. Import the pool configuration (Now it securely reads DB_HOST as "postgres")
const pool = require("./config/db");

// 3. Verify connection pool handshake stability
pool.connect()
    .then(() => {
        console.log("PostgreSQL connected successfully ✅");
    })
    .catch((err) => {
        console.error("Database connection failed ❌:", err);
    });

const app = express();
app.use(cors());
app.use(express.json());

// 4. NOW run initialization migrations safely 
require("./init-db");

// --- API Endpoints ---

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Node.js backend 🚀",
    });
});

// Create user
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

// Get users
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});