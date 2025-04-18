


{/* <div class="edit-group">
<p id="resetPassword">Reset Password</p>
<button id="resetPasswordBtn">
  <img
    src="/images/profile/edit_24dp_006540_FILL1_wght400_GRAD0_opsz24.svg"
    alt=""
  />
</button>
</div>

<!-- Reset Password Modal -->
<div id="resetPasswordModal" class="modal">
<div class="modal-content">
  <span class="close-button" id="closeResetModal">&times;</span>
  <h2>Reset Password</h2>
  <p>Please enter your email to reset your password.</p>
  <input
    type="email"
    id="resetEmailInput"
    placeholder="Enter your email"
    required
  />
  <button id="sendResetBtn">Send Reset Link</button>
</div>
</div> */}
// Firebase Auth
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
const auth = getAuth();

const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetPasswordModal = document.getElementById("resetPasswordModal");
const closeResetModal = document.getElementById("closeResetModal");
const sendResetBtn = document.getElementById("sendResetBtn");
const resetEmailInput = document.getElementById("resetEmailInput");
const errorMessage = document.getElementById("error-message");



resetPasswordBtn.addEventListener("click", ()=>{
  resetPasswordModal.style.display ="block";
})

closeResetModal.addEventListener("click", ()=>{
  resetPasswordModal.style.display ="none";
})

sendResetBtn.addEventListener("click", async() =>{
  const email = resetEmailInput.value.trim();

  if(!email){
    errorMessage.innerHTML = `<p>Please fill out the input field.</p>`;
    return;
  }

  try {
    await sendPasswordResetEmail (auth, email);
    alert(`Password reset link sent to ${email}. Please check your inbox.`);

    resetPasswordModal.style.display = "none";
  } catch (error) {
    alert("Error sending reset email: " + error.message);
  }
})