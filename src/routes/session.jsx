import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
// useLocation = "What page am I on, and what data was sent to me?"
// useNavigate = "Redirects user to another page programmatically, rather than clicking a link"
import '../styles/session.css';

export default function Session() {
    const location = useLocation();
    const navigate = useNavigate();

    // Setting up Countdown Shenanigans
    const minutes = location.state?.minutes ?? 5;
    
    const totalSeconds = minutes * 60;
    const [remaining, setRemaining] = useState(totalSeconds);

    // Countdown Shenanigans
    useEffect(() => {
        const id = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [totalSeconds]);

    // Breathing Cycle
    let cycleDuration = 8;

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    // Breathing Cycle Text
    const [breathPhase, setBreathPhase] = useState("Inhale");

    return (
        <body className="session-page">
            <div>
                <div className = "orb-wrapper">
                    <div className = "orb" style = {{ "--cycle-duration": `${cycleDuration}s` }}>
                    </div>
                    <div className = "timer">
                        {mins.toString().padStart(2, "0")}:
                        {secs.toString().padStart(2, "0")}
                    </div>

                    {remaining === 0 && (
                        <button className = "finish-button" onClick = {() => navigate('/')} >
                            Finish Session - Back Home
                        </button>
                    )}
                </div>
            </div>
        </body>
    )
}