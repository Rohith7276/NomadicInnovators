// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth"
import {signInWithPopup} from "firebase/auth" 
import { GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDQTtLTp-gsu-7Sx7dNws6sKrpAGNHPIgQ",
  authDomain: "travel-d4acf.firebaseapp.com",
  projectId: "travel-d4acf",
  storageBucket: "travel-d4acf.firebasestorage.app",
  messagingSenderId: "1026654936314",
  appId: "1:1026654936314:web:7dbf3d6b46bb46bd427d43",
  measurementId: "G-Z7T16EVF7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app)
const storage = getStorage(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider(); 
// const analytics = getAnalytics(app);
export {auth,storage, provider  , app, fireDB, signInWithPopup}