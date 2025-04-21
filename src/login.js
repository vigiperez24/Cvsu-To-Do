import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"; 
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js"; 
import {
  getAuth, // Firebase Authentication
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore, // Firestore for database
  getDoc, 
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration (replace with your Firebase project's config)
const firebaseConfig = {
  apiKey: "AIzaSyBA6nhXjrNVLXc2ZrRQtWAIb8fH-OKQYic",
  authDomain: "cvsu-to-do-fda9a.firebaseapp.com",
  projectId: "cvsu-to-do-fda9a",
  storageBucket: "cvsu-to-do-fda9a.appspot.com",
  messagingSenderId: "831938988582",
  appId: "1:831938988582:web:8e957ce70aa358e1f7b4e7",
  measurementId: "G-W30F99SD5S",
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); 

// Wait for the DOM to be fully loaded before running the script
window.addEventListener("DOMContentLoaded", () => {
  const errorMessage = document.getElementById("error-message"); 
  const loginBtn = document.getElementById("loginBtn"); 
  const agreeCheckbox = document.getElementById("agreeCheckbox"); 

  // Enable or disable the login button based on the "agree" checkbox status
  agreeCheckbox.addEventListener("change", () => {
    loginBtn.disabled = !agreeCheckbox.checked; // Disable the login button if checkbox is unchecked
  });

  // Handle the login button click
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get email and password input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate that email and password are entered
    if (!email || !password) {
      errorMessage.innerHTML = `<p>Please fill out the input field.</p>`; // Show error if any field is empty
      return;
    }

    try {
      // Attempt to sign in the user with the provided email and password using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user data after successful login

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid); // Assuming "users" is the collection where user data is stored
      const userSnap = await getDoc(userRef);
      
      // If the user doesn't exist in Firestore, sign them out
      if (!userSnap.exists()) {
        await signOut(auth); // Sign out the user if they are not found in Firestore
        errorMessage.textContent = "Your account no longer exists.";
      } else {
        // If the user exists in Firestore, proceed to the default page
        window.location.href = "default.html";
        alert("Login Successful!"); 
      }
    } catch (error) {
      alert("Error: " + error.message); // Show error message if login fails
    }
  });
});
