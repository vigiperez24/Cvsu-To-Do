// Get Elements
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetPasswordModal = document.getElementById("resetPasswordModal");
const closeResetModal = document.getElementById("closeResetModal");
const sendResetBtn = document.getElementById("sendResetBtn");
const resetEmailInput = document.getElementById("resetEmailInput");

// Firebase Auth
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
const auth = getAuth();

// Show Modal
resetPasswordBtn.addEventListener("click", () => {
  resetPasswordModal.style.display = "block"; // Show the modal
});

// Close Modal
closeResetModal.addEventListener("click", () => {
  resetPasswordModal.style.display = "none"; // Close the modal
});

// Send Reset Link
sendResetBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();

  // Validate email
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    // Send reset link via Firebase Auth
    await sendPasswordResetEmail(auth, email);

    // Display success alert
    alert(`Password reset link sent to ${email}. Please check your inbox.`);
    
    // Close modal after success
    resetPasswordModal.style.display = "none";
  } catch (error) {
    alert("Error sending reset email: " + error.message);
  }
});
