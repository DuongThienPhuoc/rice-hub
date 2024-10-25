import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCmD1NtV7bTgrL5KKKP14i1rQhMP62rQxE",
    authDomain: "sep490-backend.firebaseapp.com",
    projectId: "sep490-backend",
    storageBucket: "sep490-backend.appspot.com",
    messagingSenderId: "588977550253",
    appId: "1:588977550253:web:6e095491dc7c1a468ea724",
    measurementId: "G-MZ4TVGRBKD"
};

const app = initializeApp(firebaseConfig);

export default app;