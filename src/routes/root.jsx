import { Link, Outlet } from "react-router-dom";
import Header from '../components/Header.jsx';
import QuoteWidget from "../components/QuoteWidget.jsx";

//Image Imports (If I dont do this, npm run preview won't get the images correctly)
import monk from "../assets/Monk.png";

import '../styles/index.css';
import '../styles/root.css';
import '../styles/selection.css';

export default function Root() {
  return (
    <div className="app-wrapper">
      <div className="app-card">
        {/* Header */}
        <div className="app-header">
          <Header title="Mindful Mana" />
        </div>

        {/* Monk image */}
        <div className="monk-image">
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
  );
}
