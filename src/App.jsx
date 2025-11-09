import { useState } from 'react'
import './App.css'

function MeditationType({ image, minutes }) {
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
        <article>
            <MeditationType image="src/assets/Koi.png" minutes={5} />
            <MeditationType image="src/assets/Lily.png" minutes={15} />
            <MeditationType image="src/assets/Koi.png" minutes={25} />
        </article>
      </div>
    </>
  )
}

export default App
