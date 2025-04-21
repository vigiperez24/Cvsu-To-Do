// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA6nhXjrNVLXc2ZrRQtWAIb8fH-OKQYic",
  authDomain: "cvsu-to-do-fda9a.firebaseapp.com",
  projectId: "cvsu-to-do-fda9a",
  storageBucket: "cvsu-to-do-fda9a.appspot.com",
  messagingSenderId: "831938988582",
  appId: "1:831938988582:web:8e957ce70aa358e1f7b4e7",
  measurementId: "G-W30F99SD5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  doc,
};
