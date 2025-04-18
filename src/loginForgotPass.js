import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

//  Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA6nhXjrNVLXc2ZrRQtWAIb8fH-OKQYic",
  authDomain: "cvsu-to-do-fda9a.firebaseapp.com",
  projectId: "cvsu-to-do-fda9a",
  storageBucket: "cvsu-to-do-fda9a.appspot.com",
  messagingSenderId: "831938988582",
  appId: "1:831938988582:web:8e957ce70aa358e1f7b4e7",
  measurementId: "G-W30F99SD5S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // Firestore instance

const loginBtn = document.getElementById("loginBtn");
const errorMessage = document.getElementById("error-message");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        errorMessage.innerHTML = `<p>Please fill out the input field.</p>`;
        return;
    }

    try {
        // Check Firestore for previous password reset attempts
        const userRef = doc(db, "password_resets", email); // Unique document for each email
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastReset = userData.lastReset;
            const resetCount = userData.resetCount || 0;
            const currentTime = new Date();

            // Check if the user attempted more than 3 resets today
            if (resetCount >= 3) {
                const lastResetTime = new Date(lastReset.seconds * 1000); // Firebase timestamp to JS date
                const timeDiff = currentTime - lastResetTime; // Difference in milliseconds

                if (timeDiff < 86400000) { // 86400000 ms = 24 hours
                    errorMessage.style.color = "red";
                    errorMessage.textContent = "You have exceeded the reset limit for today. Please try again tomorrow.";
                    return;
                } else {
                    // Reset count can be cleared after 24 hours
                    await updateDoc(userRef, {
                        resetCount: 0,
                        lastReset: currentTime
                    });
                }
            }
        } else {
            // No previous data, initialize user record in Firestore
            await setDoc(userRef, {
                resetCount: 0,
                lastReset: new Date()
            });
        }

        // Send password reset email
        await sendPasswordResetEmail(auth, email);

        // Update reset count and timestamp in Firestore
        await updateDoc(userRef, {
            resetCount: (userDoc.exists() ? userDoc.data().resetCount : 0) + 1,
            lastReset: new Date()
        });

        errorMessage.style.color = "green";
        errorMessage.textContent = `Reset link sent to ${email}.`;
        loginBtn.disabled = true;

    } catch (error) {
        errorMessage.style.color = "red";
        errorMessage.textContent = error.message;
    }
});
