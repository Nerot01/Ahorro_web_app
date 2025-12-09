// ⚠️ RENOMBRA ESTE ARCHIVO A: firebase.js
// Y pon tus claves reales aquí.

const firebaseConfig = {
    apiKey: "PON_TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "00000000000",
    appId: "1:00000000:web:00000000000",
    measurementId: "G-XXXXXXXX"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

window.db = db;
window.auth = auth;
window.googleProvider = googleProvider;
