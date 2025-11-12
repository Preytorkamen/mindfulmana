import { Link, Outlet } from "react-router-dom";
import Header from '../components/Header.jsx';

import '../styles/index.css';
import '../styles/selection.css';
import '../styles/meditation-card.css';

//Dummy root component mockup (Chat GPT), will replace later
export default function Root() {
  return (
    <div>
      {/* Header / Navbar */}
      <Header title="Mindful Mana — Daily Meditations" />
        <h1 className="text-xl font-semibold text-gray-800">
          <Link to="selection">Meditations</Link>
        </h1>
        <nav>
          <Link
            to="/about"
            className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
          >
            About
          </Link>
        </nav>

      {/* Page Content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>

      {/* Optional Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Meditation App
      </footer>
    </div>
  );
}