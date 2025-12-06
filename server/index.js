// Import libraries. Express let's me create an HTTP server more easily than
// with just raw node. CORS middleware allows my frontend on a different port
// to talk to this backend. The dotenv library reads a .env file and puts
// the values into process.env.

import { query } from './db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Load environment variables from .env file into process.env
dotenv.config(); 

// express() creates an Express application object. This app is my server. I
// attach routes and middleware to it.
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend

app.use(express.json()); // Parse JSON request bodies

// Simple test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'okay', message: 'MindfulMana backend is legit and lit'});
});

// A couple of random quotes to serve up
const quotes = [
    "The mind is everything. What you think you become. - Buddha",
    "Peace comes from within. Do not seek it without. - Buddha",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
    "In the middle of every difficulty lies opportunity. - Albert Einstein"
];

app.get('/api/quotes/random', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});