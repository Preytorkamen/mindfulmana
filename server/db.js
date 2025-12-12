import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;


// Error Handling
const requiredVariables = ["PG_USER", "PG_HOST", "PG_DATABASE", "PG_PASSWORD", "PG_PORT"];
requiredVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Database config environment variable missing: ${key}`);
    }
});

// Creating the Pool
const pool = new Pool ({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});


// Exporting the Query Function
export function query(text, params) {
    return pool.query(text, params);
}