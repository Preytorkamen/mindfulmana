// Import libraries. Express let's me create an HTTP server more easily than
// with just raw node. CORS middleware allows my frontend on a different port
// to talk to this backend. The dotenv library reads a .env file and puts
// the values into process.env.

import { query } from './db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from "pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Token
function createToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }        
    );
}

// Auth Middleware to protect routes
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or Invalid Token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (err) {
        console.error('JWT verify error: ', err);
        return res.status(401).json({ error: 'Invalid token'});
    }
}

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

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || password.length < 6) {
            return res
                .status(400)
                .json({ error: 'Email and 6+ character password requred'});
        }

        // Does user exist?
        const existing = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email already in use'});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(
            `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at`,
            [email, passwordHash]
        );

        const user = result.rows[0];
        const token = createToken(user);

        res.status(201).json({
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (err) {
        console.error('Register error: ', err);
        res.status(500).json({ error: 'Server error'});
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await query(
            `SELECT id, email, password_hash
            FROM users
            WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password'});
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = createToken(user);

        res.json({
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/me - current logged-in user
app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, email, created_at
            FROM users
            WHERE id = $1`,
            [req.user.id]
        );

        const user = result.rows[0];
        res.json({ user });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});






// Dashboard Summary
app.get('/api/sessions/summary', authMiddleware, async (req, res) => {
    try {
        // For now, include all. But later, filter by user ID
        const totalsResult = await query(
            `SELECT
                COALESCE(SUM(duration_minutes), 0) AS total_minutes,
                COUNT(*) AS total_sessions
            FROM sessions
            WHERE user_id = $1`,
            [userID]
        );

        const { total_minutes, total_sessions } = totalsResult.rows[0];

        const recentResult = await query(
            `SELECT id, duration_minutes, completed_at
            FROM sessions
            WHERE user_id = $1
            ORDER BY completed_at DESC
            LIMIT 10`,
            [userID]
        );

        const dailyResult = await query(
            `SELECT
                DATE(completed_at) AS date,
                SUM(duration_minutes) AS minutes
            FROM sessions
            WHERE user_id = $1
                AND completed_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(completed_at)
            ORDER BY DATE(completed_at) ASC`,
            [userID]
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
app.post('/api/sessions', authMiddleware, async (req, res) => {
    try {
        const { durationMinutes } = req.body;

        // Quick validation
        if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
            return res
            .status(400)
            .json({ error: 'durationMinutes must be a positive integer' });
        }

        // I will use real userID from auth later. Null for now
        const userID = req.user.id;

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