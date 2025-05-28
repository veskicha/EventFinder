import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfFhKgnwt11Y04j9dY1J_9ByRj4eNGeJM",
    authDomain: "eventfinder-62d47.firebaseapp.com",
    projectId: "eventfinder-62d47",
    storageBucket: "eventfinder-62d47.firebasestorage.app",
    messagingSenderId: "28515216821",
    appId: "1:28515216821:web:b82c66c8c01f8147c3bdfc",
    measurementId: "G-X6EREKMR7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth, signInWithEmailAndPassword };
export const db = getFirestore(app);