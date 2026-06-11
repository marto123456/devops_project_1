const pool = require("./config/db");

async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE
    );
  `);

    console.log("Database initialized");
}

initDb();