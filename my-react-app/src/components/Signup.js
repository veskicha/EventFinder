import React, { useState } from "react";
import { auth } from "../firebase"; // Ensure this correctly imports your auth instance
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/Auth.css";
import logo from "../logo-removebg-preview.png"; // Update the path as needed

const Signup = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="logo">
                <img src={logo} alt="EventFinder Logo" />
            </div>
            <div className="auth-box">
                <h2>Регистрация</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="Имейл"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Парола"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignup}>Регистрирай се</button>
                <p>
                    Имате акаунт? <a href="/">Влизане</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
