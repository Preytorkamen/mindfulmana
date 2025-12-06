import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../apiconfig.js';

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

    return (
        <div className="stats-card">
      <h2 className="stats-title">Your Mindful Mana</h2>

      <div className="stats-grid">
        <Stat label="Total Minutes" value={totalMinutes} />
        <Stat label="Sessions" value={totalSessions} />
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

function Stat({ label, value }) {
    return (
        <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
    );
}