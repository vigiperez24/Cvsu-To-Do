import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
const auth = getAuth();

const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetPasswordModal = document.getElementById("resetPasswordModal");
const closeResetModal = document.getElementById("closeResetModal");
const sendResetBtn = document.getElementById("sendResetBtn");
const resetEmailInput = document.getElementById("resetEmailInput");
const errorMessage = document.getElementById("error-message");

resetPasswordBtn.addEventListener("click", () => {
  resetPasswordModal.style.display = "block";
});

closeResetModal.addEventListener("click", () => {
  resetPasswordModal.style.display = "none";
});

sendResetBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();

  if (!email) {
    errorMessage.innerHTML = `<p>Please fill out the input field.</p>`;
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert(`Password reset link sent to ${email}. Please check your inbox.`);

    resetPasswordModal.style.display = "none";
  } catch (error) {
    alert("Error sending reset email: " + error.message);
  }
});
