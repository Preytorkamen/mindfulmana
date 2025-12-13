import { useState } from "react";
import Header from "../components/Header.jsx";


const API = "http://localhost:5000/api";

export default function AuthScreen({ onAuthSuccess }) {
    const [mode, setMode] = useState("login"); // "login" or "register"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const endpoint =
            mode === "login" ? "/auth/login" : "/auth/register";

        try {
            const res = await fetch(API + endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            onAuthSuccess(data); // { user, token }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="root-page bg-landing1">
            <div className="app-wrapper">
                <div className="app-card bg-ghost">
                    <Header title="Mindful Mana"/>
                    <h3>{mode === "login" ? "Log In" : "Create Account"}</h3>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-container">

                            <div className="field">
                                <label htmlFor="email"> Email </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="password"> Password </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <div className="button-container">
                            <button className="form-btn primary ghost" type="submit">
                            {mode === "login" ? "Log In" : "Sign Up"}
                            </button>

                            <button
                                className=" form-btn primary ghost"
                                onClick={() =>
                                setMode(mode === "login" ? "register" : "login")
                                }
                            >
                                {mode === "login"
                                ? "Register"
                                : "Log In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  );
}