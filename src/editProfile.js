import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Elements
const nameModal = document.getElementById("nameModal");
const contactModal = document.getElementById("contactModal");

const editNameBtn = document.getElementById("editNameBtn");
const editContactBtn = document.getElementById("editContactBtn");
const closeNameModal = document.getElementById("closeNameModal");
const closeContactModal = document.getElementById("closeContactModal");

const saveNameBtn = document.getElementById("saveNameBtn");
const saveContactBtn = document.getElementById("saveContactBtn");

const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const contactInput = document.getElementById("contactInput");

const displayName = document.getElementById("displayName");
const contactNo = document.getElementById("contactNo");

// Open Modals
editNameBtn.addEventListener("click", () => {
  nameModal.style.display = "block";
});

editContactBtn.addEventListener("click", () => {
  contactModal.style.display = "block";
});

// Close Modals
closeNameModal.addEventListener("click", () => {
  nameModal.style.display = "none";
});

closeContactModal.addEventListener("click", () => {
  contactModal.style.display = "none";
});

// Detect current user
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    // Capitalize first letters of names
    const capitalizedFirstName =
      data.firstName.charAt(0).toUpperCase() +
      data.firstName.slice(1).toLowerCase();
    const capitalizedLastName =
      data.lastName.charAt(0).toUpperCase() +
      data.lastName.slice(1).toLowerCase();

    displayName.textContent = `Name: ${capitalizedFirstName} ${capitalizedLastName}`;
    contactNo.textContent = `Contact No: ${data.contactNumber || "Not set"}`;
  }

  // Save Name
  saveNameBtn.addEventListener("click", async () => {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (!firstName || !lastName) {
      alert("Please fill in both first and last name.");
      return;
    }

    const RegExfullName = /^[A-Za-z\s]+$/;
    if (!RegExfullName.test(firstName) || !RegExfullName.test(lastName)) {
      alert("Only letters are allowed. No symbols or numbers.");
      return;
    }

    await updateDoc(userRef, {
      firstName,
      lastName,
    });

    const capitalizedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const capitalizedLastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    displayName.textContent = `Name: ${capitalizedFirstName} ${capitalizedLastName}`;
    nameModal.style.display = "none";
    alert("Name updated successfully!");
    window.location.reload();
  });

  // Save Contact Number
  saveContactBtn.addEventListener("click", async () => {
    const contact = contactInput.value.trim();

    if (!contact) {
      alert("Please enter a contact number.");
      return;
    }

    const RegExPhone = /^[0-9]{10,11}$/;
    if (!RegExPhone.test(contact)) {
      alert(
        "Please enter a valid contact number (11 digits only. Ex: 09xxxxxxxxx)."
      );
      return;
    }

    await updateDoc(userRef, {
      contactNumber: contact,
    });

    contactNo.textContent = `Contact No: ${contact}`;
    contactModal.style.display = "none";
    alert("Contact number updated successfully!");
    window.location.reload();
  });
});
