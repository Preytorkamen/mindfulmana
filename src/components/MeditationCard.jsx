export default function MeditationCard({ image, minutes }) {
  return (
    <div className="meditationCard">
    <img
      src={image}
      alt="Meditation Icon"
    />
    <h1> {minutes} Minutes </h1>
    </div>
  );
}