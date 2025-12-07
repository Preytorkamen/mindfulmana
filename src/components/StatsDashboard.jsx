import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../apiconfig.js';
import '../styles/backgrounds.css';
import '../styles/stats-dashboard.css';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

export default function StatsDashboard({ refreshKey = 0 }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSummary() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${API_BASE_URL}/api/sessions/summary`);
                if (!res.ok) throw new Error("Failed to fetch sessions summary");
                const data = await res.json();
                setSummary(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }   
        fetchSummary();
    }, []); // Put refreshKey in dependency array later if needed

    if (loading) return <div>Loading your stats...</div>
    if (error) return <div>Error: {error}</div>
    if (!summary) return null;

    const { totalMinutes, totalSessions, dailyMinutes, recentSessions } = summary;
    const totalHours = (totalMinutes / 60).toFixed(1);
    const avgSessionLength = totalSessions
        ? (totalMinutes / totalSessions).toFixed(1)
        : 0;
    const dailyMinutesChartData = (dailyMinutes || []).map((d) => ({
        label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        minutes: d.minutes,
    }));

    return (
    <div className="stats-dashboard">
        <h2 className="stats-title">Your Mana</h2>
        <p className="stats-subtitle-main">
            A calm overview of your meditation practice.
        </p>

        {/* Top Stats Row */}
        <div className="stats-grid">
            <div className="db-stat bg-ghost">
                <Stat label="Total Minutes" value={totalMinutes} subtext={`${totalHours} hours`}/>
            </div>
            <div className="db-stat bg-ghost">
                <Stat label="Sessions" value={totalSessions} subtext="Every sit is a step in your journey"/>
            </div>
            <div className="db-stat bg-ghost">
                <Stat label="Avg Session" value={`${avgSessionLength} min`} subtext="On average per session"/>
            </div>
        </div>

        {/* Daily Minutes Chart */}
        <div className="chart bg-ghost">
            <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyMinutesChartData}  margin={{ top: 20, right: 50, bottom: 20, left: 0 }}>
                <XAxis dataKey="label" stroke="white"/>
                <YAxis stroke="white"/>
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="#ffffffff" strokeWidth={3} dot={{ r: 6}} />
            </LineChart>
            </ResponsiveContainer>
        </div>

      <h3 className="stats-subtitle">Recent Sessions</h3>
      <ul className="recent-sessions">
        {recentSessions.map((s) => (
          <li key={s.id} className="recent-session-item">
            <span>{s.duration_minutes} min</span>
            <span>
              {new Date(s.completed_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
      </ul>

      {/* Tomorrow: pipe dailyMinutes into a chart component */}
    </div>
    );
}

function Stat({ label, value, subtext }) {
    return (
        <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
    );
}