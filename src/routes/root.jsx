import { Link, Outlet } from "react-router-dom";
import Header from '../components/Header.jsx';

import '../styles/index.css';
import '../styles/root.css';
import '../styles/selection.css';
import '../styles/meditation-card.css';

//Dummy root component mockup (Chat GPT), will replace later
export default function Root() {
  return (
    <div>
      <Header title="Mindful Mana — Daily Meditations" />
        <div className="monk-image" >
          <img src="../src/assets/Monk.png" alt="MonkImage"></img>
        </div>
        <button className="large-ghost">
          <Link to="selection">Begin Meditation</Link>
        </button>
    </div>
  );
}