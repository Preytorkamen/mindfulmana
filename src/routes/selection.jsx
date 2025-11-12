import { useState } from 'react'
import Header from '../components/Header.jsx';
import MeditationCard from '../components/MeditationCard.jsx';

function Selection() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="selection-page">
        <Header title="Session Length" />
      <div className="body-section">
        <div className="list-container">
          <article>
              <MeditationCard image="src/assets/Koi.png" minutes={5} />
              <MeditationCard image="src/assets/Lily.png" minutes={15} />
              <MeditationCard image="src/assets/Wave.png" minutes={25} />
          </article>
        </div>
      </div>
    </div>
    </>
  )
}

export default Selection
