import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../apiconfig.js";
// useLocation = "What page am I on, and what data was sent to me?"
// useNavigate = "Redirects user to another page programmatically, rather than clicking a link"
import '../styles/session.css';


export default function Session() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Setting up Countdown Shenanigans
    const minutes = location.state?.minutes ?? 5;
    const totalSeconds = minutes * 60;
    
    // Timer
    const [remaining, setRemaining] = useState(totalSeconds);
    const [isPaused, setIsPaused] = useState(false);
    
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    
    // Breathing Cycle Text
    const [breathPhase, setBreathPhase] = useState("Inhale");
    const prevPhaseRef = useRef("Inhale");

    // Cycle Duration
    const cycleDuration = 8; // Seconds for one in-hold-out cycle

    // Countdown Shenanigans
    useEffect(() => {
        if (isPaused) return;

        const id = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [totalSeconds, isPaused]);
   
    // Breathing Phase Shenanigans
    useEffect(() => {
        if (isPaused) return;

        const cycleMs = cycleDuration * 1000;
        const inhaleEnd = cycleMs * 0.4; // 0-40% Inhale
        const holdEnd = cycleMs * 0.6;   // 40%-60% Hold, then Exhale

        const start = performance.now();

        const id = setInterval(() => {
            const now = performance.now();
            const t = (now - start) % cycleMs;

            let nextPhase;

            if (t < inhaleEnd) nextPhase = "Inhale";
            else if (t < holdEnd) nextPhase = "Hold";
            else nextPhase = "Exhale";

            if (nextPhase !== prevPhaseRef.current) {
                prevPhaseRef.current = nextPhase;
                setBreathPhase(nextPhase);

                // Vibrate on phase change
               if ("vibrate" in navigator) {
                    if (nextPhase === "Inhale") {
                        navigator.vibrate(80);
                    } else if (nextPhase === "Hold") {
                        navigator.vibrate([60, 40, 60]);
                    } else if (nextPhase === "Exhale") {
                        navigator.vibrate(120);
                    }
                }
 
            }
        }, 150);
        return () => clearInterval(id);
    }, [cycleDuration, isPaused]);

    // Make sure I only log once per session
    const hasLoggedRef = useRef(false);

    // When the timer hits 0, log the session once
    useEffect(() => {
        if (remaining === 0 && !hasLoggedRef.current) {
            hasLoggedRef.current = true;
            logSession();
        }
    }, [remaining]);

    // Call backend to log this session
    async function logSession() {
        try {
            await fetch(`${API_BASE_URL}/api/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ durationMinutes: minutes }),
            });
        } catch (err) {
            console.error("Failed to log session:", err);
        }
    }


    return (
        <div className="session-page bg-landing1">
            <div className="app-wrapper">
                <div className="app-card bg-ghost">
                    <div className="orb-components-container">
                        <div className="orb-wrapper">
                            {/* Actual Orb Ball*/}
                            <div className = "orb bg-orb" style = {{ 
                                "--cycle-duration": `${cycleDuration}s`,
                                animationPlayState: isPaused ? "paused" : "running"}}>
                            </div>
                            {/* Inhale / Hold / Exhale Text */}
                            <div className={`breath-cue breath-${breathPhase}`}>
                                {breathPhase === "Inhale" && "Breathe In"}
                                {breathPhase === "Hold" && "Hold"}
                                {breathPhase === "Exhale" && "Exhale"}
                            </div>
                        </div>

                        {/* Timer and Controls */}
                        <div className="session-info">
                            <div className = "timer">
                                {mins.toString().padStart(2, "0")}:
                                {secs.toString().padStart(2, "0")}
                            </div>

                            {/* Session Complete Message     */}
                            {remaining === 0 && (
                                <h4>
                                    Session complete. You can calmly return whenever you're ready.
                                </h4>
                            )}     
                            <div className="session-controls">
                                <button
                                    className="session-button ghost"
                                    onClick={() => setIsPaused((p) => !p)}>
                                    {isPaused ? "Resume" : "Pause"}
                                </button>

                                <button
                                    className="session-button ghost"
                                    onClick={() => navigate("/")}>
                                        End Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}