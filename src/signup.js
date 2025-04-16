
// Sign up profile

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA6nhXjrNVLXc2ZrRQtWAIb8fH-OKQYic",
  authDomain: "cvsu-to-do-fda9a.firebaseapp.com",
  projectId: "cvsu-to-do-fda9a",
  storageBucket: "cvsu-to-do-fda9a.appspot.com",
  messagingSenderId: "831938988582",
  appId: "1:831938988582:web:8e957ce70aa358e1f7b4e7",
  measurementId: "G-W30F99SD5S"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Signup Form Handling using click event
window.addEventListener('DOMContentLoaded', () => {
  const errorMessage = document.getElementById('error-message');
  const signupBtn = document.getElementById('signupBtn'); // assuming button id="signupBtn"

  signupBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // prevent form from refreshing page on button click

    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    if (!firstName || !lastName || !email || !password) {
      errorMessage.textContent ="Please fill out the input field.";
      return;
    }
    const RegExfullName = /^[A-Za-z]+$/;
    if (!RegExfullName.test(firstName) || !RegExfullName.test(lastName)) {
      errorMessage.textContent ="Only letters are allowed. No symbols or numbers.";
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date()
      });

      alert('Signup Successful!');
      window.location.href = "profile.html";
    } catch (error) {
      alert('Error: ' + error.message);

    }
  });
});
