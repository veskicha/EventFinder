// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Home from "./components/Home"; // The new Home component
import Signup from "./components/Signup";
import Login from "./components/Login";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={<Signup setUser={setUser} />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
