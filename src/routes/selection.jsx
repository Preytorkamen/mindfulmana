import { useState } from 'react'
import Header from '../components/Header.jsx';
import MeditationCard from '../components/MeditationCard.jsx';

import '../styles/selection.css';
import '../styles/meditation-card.css';



function Selection() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <div className="body-section">
        <div className="list-container">
          <article>
              <MeditationCard image="src/assets/Koi.png" minutes={5} />
              <MeditationCard image="src/assets/Lily.png" minutes={15} />
              <MeditationCard image="src/assets/Wave.png" minutes={25} />
          </article>
        </div>
      </div>
    </>
  )
}

export default Selection
