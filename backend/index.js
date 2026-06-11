require("dotenv").config();
require("./init-db");

const express = require("express");
const cors = require("cors");


const pool = require("./config/db");

pool.connect()
    .then(() => {
        console.log("PostgreSQL connected");
    })
    .catch((err) => {
        console.error(err);
    });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Node.js backend 🚀",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});


// Create user
app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `
      INSERT INTO users(name,email)
      VALUES($1,$2)
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
        const result = await pool.query(
            "SELECT * FROM users"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});