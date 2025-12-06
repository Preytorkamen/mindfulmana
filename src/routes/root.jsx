import { Link, Outlet } from "react-router-dom";
import Header from '../components/Header.jsx';
import QuoteWidget from "../components/QuoteWidget.jsx";

//Image Imports (If I dont do this, npm run preview won't get the images correctly)
import monk from "../assets/Monk.png";

import '../styles/index.css';
import '../styles/root.css';
import '../styles/backgrounds.css';
import StatsDashboard from "../components/StatsDashboard.jsx";

export default function Root() {
  return (
    <div className="root-page bg-landing1">
      <div className="app-wrapper">
        <div className="app-card bg-ghost">
          
          {/* Header */}
          <div className="app-header">
            <Header title="Mindful Mana" />
          </div>

          {/* Monk image */}
          <div className="monk-image bg-moon">
            <img src={monk} alt="Monk" />
          </div>

          {/* Button to go to selection page */}
          <Link to="selection" className="begin-link">
            <button className="ghost">
              Begin Meditation
            </button>
          </Link>

          {/* Quote (not a link) */}
          <QuoteWidget />
        </div>
      </div>
        <section className="home-stats-section">
          <StatsDashboard />
        </section>
    </div>
  );
}
