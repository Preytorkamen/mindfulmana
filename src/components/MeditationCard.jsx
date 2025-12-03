import { Link } from "react-router-dom";
import '../styles/meditation-card.css';

export default function MeditationCard({ image, minutes }) {
  return (
    <Link
      to="/session"
      state={{ minutes }}  // Pass the minutes as route state
      className="meditationCard"
    >
      <img src={image} alt="Meditation Icon" />
      <h1>{minutes} Minutes</h1>
    </Link>
  );
}