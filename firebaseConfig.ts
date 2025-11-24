import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATg7fcVDjMQszFXamZ1QI-SvXP5Q9TIqo",
    authDomain: "menutrebol.firebaseapp.com",
    projectId: "menutrebol",
    storageBucket: "menutrebol.firebasestorage.app",
    messagingSenderId: "565707863950",
    appId: "1:565707863950:web:13f7434938cece5fb316df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
