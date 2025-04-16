import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtJfHqawSI1mOptCy6ZVliVpORyCxKLLA",
  authDomain: "cvsu-to-do.firebaseapp.com",
  projectId: "cvsu-to-do",
  storageBucket: "cvsu-to-do.appspot.com",
  messagingSenderId: "732467951902",
  appId: "1:732467951902:web:b7c90317d1b73ecf37310f",
  measurementId: "G-MWQFR21YL8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupBtn = document.getElementById("signupBtn");
const errorMessage = document.getElementById("error-message");

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstname").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !email || !password) {
    errorMessage.innerHTML = `<p style ="text-align:center;" >Please fill in all fields.</p>`;
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("User created successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
    });
});