import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header.jsx";
import QuoteWidget from "../components/QuoteWidget.jsx";
import AuthScreen from "./authscreen";
import monk from "../assets/Monk.png";
import Session from "./session";

import "../styles/index.css";
import "../styles/root.css";
import "../styles/backgrounds.css";
import StatsDashboard from "../components/StatsDashboard.jsx";

export default function Home() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user
      ? { token, user: JSON.parse(user) }
      : { token: null, user: null };
  });

  const user = auth.user;
  const token = auth.token;

  function handleAuthSuccess({ user, token }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, token });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null });
  }

  if (!token) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="root-page bg-landing1">
      <div className="app-wrapper">
        <div className="app-card bg-ghost">
          <div className="app-header">
            <Header title="Mindful Mana" />
            <h4>Welcome, {user?.email}</h4>
            <button onClick={handleLogout} className="logout-btn ghost">
              Log Out
            </button>
          </div>

          <div className="monk-image bg-moon">
            <img src={monk} alt="Monk" />
          </div>

          <Link to="selection" className="begin-link">
            <button className="ghost">Begin Meditation</button>
          </Link>

          <QuoteWidget />
        </div>
      </div>
      <div className="dashboard-card bg-ghost">
        <section className="home-stats-section">
          <StatsDashboard user={user} token={token} />
        </section>
      </div>
    </div>
  );
}
