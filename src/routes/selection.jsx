import { useState } from 'react'
import Header from '../components/Header.jsx';
import MeditationCard from '../components/MeditationCard.jsx';

//Image Imports (If I dont do this, npm run preview won't get the images correctly)
import koi from "../assets/Koi.png";
import lily from "../assets/Lily.png";
import wave from "../assets/Wave.png";

function Selection() {
  //const [count, setCount] = useState(0)

  return (
    <>
    <div className="selection-page bg-landing1">
      <div className="app-wrapper">
        <div className="app-card bg-ghost">

          {/* Header */}
          <div className="app-header">
              <Header title="Session Length" />
            <div className="body-section">

              {/* Meditation Cards */}
              <div className="list-container">
                <article>
                    <MeditationCard image= {koi} alt="Koi" minutes={1} />
                    <MeditationCard image= {lily} alt="Lily" minutes={15} />
                    <MeditationCard image= {wave} alt="Wave" minutes={25} />
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Selection
