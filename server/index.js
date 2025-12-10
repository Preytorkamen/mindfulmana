// Import libraries. Express let's me create an HTTP server more easily than
// with just raw node. CORS middleware allows my frontend on a different port
// to talk to this backend. The dotenv library reads a .env file and puts
// the values into process.env.

import { query } from './db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Helper function for GET /api/sessions/summary for Dashboard
function buildDailyMinutes(rows) {
    const map = new Map(); // Using a map instead of an object to stay clean

    for (const row of rows) {
        const d = new Date(row.completed_at);
        const key = d.toISOString().slice(0,10); // Takes the weird date format and slices to YYYY-MM-DD
        map.set(key, (map.get(key) || 0) + row.duration_minutes);
    }

    return Array.from(map.entries())
        .sort(([a],[b]) => (a < b ? -1 : 1))    // Sort by date, ascending
        .map(([date, minutes]) => ({ date, minutes })); // Formatting
}


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


// POSTGRESQL DATABASE STUFF
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

// Dashboard Summary
app.get('/api/sessions/summary', async (req, res) => {
    try {
        // For now, include all. But later, filter by user ID
        const totalsResult = await query(
            `SELECT
                COALESCE(SUM(duration_minutes), 0) AS total_minutes,
                COUNT(*) AS total_sessions
            FROM sessions`
        );

        const { total_minutes, total_sessions } = totalsResult.rows[0];

        const recentResult = await query(
            `SELECT id, duration_minutes, completed_at
            FROM sessions
            ORDER BY completed_at DESC
            LIMIT 10`
        );

        const dailyResult = await query(
            `SELECT
            DATE(completed_at) AS date,
            SUM(duration_minutes) AS minutes
            FROM sessions
            WHERE completed_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(completed_at)
            ORDER BY DATE(completed_at) ASC`
        );

// Now dailyResult.rows is already [{ date: '2025-12-05', minutes: 5 }, ...]
const dailyMinutes = dailyResult.rows;

        res.json({
            totalMinutes: Number(total_minutes),
            totalSessions: Number(total_sessions),
            dailyMinutes,
            recentSessions: recentResult.rows,
        });
    } catch (err) {
        console.error('Error fetching summary:', err);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// POST /api/sessions (Logging a meditation session)
app.post('/api/sessions', async (req, res) => {
    try {
        const { durationMinutes } = req.body;

        // Quick validation
        if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
            return res
            .status(400)
            .json({ error: 'durationMinutes must be a positive integer' });
        }

        // I will use real userID from auth later. Null for now
        const userID = null;

        const result = await query(
            `INSERT INTO sessions (user_id, duration_minutes)
            VALUES ($1, $2)
            RETURNING id, user_id, duration_minutes, completed_at`,
            [userID, durationMinutes]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error logging session:', err);
        res.status(500).json({ error: 'Failed to log session' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});