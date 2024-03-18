const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzbkfEG892a0LU8-XwvHFlFMOuWmACYe8",
    authDomain: "maffconcecionaria.firebaseapp.com",
    projectId: "maffconcecionaria",
    storageBucket: "maffconcecionaria.appspot.com",
    messagingSenderId: "553674038681",
    appId: "1:553674038681:web:7167ae770dd4d371e10708",
    measurementId: "G-WT0W88CGFN"
};

// Inicializar la aplicación Firebase
console.log("Initializing Firebase app...");
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

module.exports = { storage };
