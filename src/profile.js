// profile.js

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const fullNameElement = document.getElementById("fullName");
    const emailElements = document.querySelectorAll(".email");
    const displayName = document.getElementById("displayName");
    const joinedSinceElement = document.getElementById("joinedSince");

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const email = userData.email;
        const createdAt = userData.createdAt;

        // Format the date
        const dateObj = createdAt.toDate();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        // Display to HTML
        fullNameElement.textContent = `Welcome, ${lastName}, ${firstName}`;
        emailElements.forEach(el => {
          el.textContent = `Email: ${email}`;
        });
        displayName.textContent = `Name: ${firstName} ${lastName}`;
        joinedSinceElement.innerHTML = `Joined Since: <strong>${formattedDate}</strong>`;

        // Console logs
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Email:", email);
        console.log(`join since: ${formattedDate}`);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }
});
