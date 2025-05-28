import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";  // Updated to use `useNavigate` for navigation
import "../styles/Auth.css";
import logo from "../logo-removebg-preview.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // Initialize useNavigate for redirection

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user);  // Handle successful login
            navigate("/");  // Navigate to Home (Events page) after successful login
        } catch (err) {
            setError(err.message);  // Handle errors
        }
    };

    const handleSignUpRedirect = () => {
        navigate("/signup");  // Redirect to signup page
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="logo">
                    <img src={logo} alt="EventFinder Logo" />
                </div>

                <div className="auth-box">
                    <h2>Влезте В Своя Акаунт</h2>
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
                    <button onClick={handleLogin}>Влизане</button>
                </div>
            </div>

            <div className="auth-right">
                <div className="signup-text">
                    <h3>Нови сте тук?</h3>
                    <p>Регистрирайте се сега и открийте събитията около вас.</p>
                </div>
                <button className="signup-button" onClick={handleSignUpRedirect}>Регистрация</button>
            </div>
        </div>
    );
};

export default Login;
