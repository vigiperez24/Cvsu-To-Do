// Firebase imports
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Show user profile info
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const fullNameElement = document.getElementById("fullName");
    const emailElements = document.querySelectorAll(".email");
    const displayName = document.getElementById("displayName");
    const joinedSinceElement = document.getElementById("joinedSince");
    const lastActiveElement = document.getElementById("lastActive");
    const userIDElement = document.getElementById("userID");

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const email = userData.email;
        const createdAt = userData.createdAt;
        const lastActive = userData.lastActive;

        // Capitalize first and last name, and email
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        const capitalizedEmail = email.charAt(0).toUpperCase() + email.slice(1).toLowerCase();

        // Format the created date
        const dateObj = createdAt.toDate();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        // Format the last active date
        const lastActiveDate = lastActive ? lastActive.toDate() : new Date();
        const formattedLastActive = lastActiveDate.toLocaleDateString('en-US', options);

        // Display user data in HTML
        fullNameElement.innerHTML = `Welcome, <strong> ${capitalizedLastName}, ${capitalizedFirstName}</strong>`;
        emailElements.forEach(el => {
          el.innerHTML = `Email: <strong>${capitalizedEmail}</strong>`;
        });
        displayName.textContent = `Name: ${capitalizedFirstName} ${capitalizedLastName}`;
        joinedSinceElement.innerHTML = `Joined Since: <strong>${formattedDate}</strong>`;
        lastActiveElement.innerHTML = `Last Active: <strong>${formattedLastActive}</strong>`;
        userIDElement.textContent = `UserID: ${user.uid}`;

        // Fetch and display task counts
        await fetchTaskCounts(user.uid);
      } else {
        alert("No such document!");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }
});

// Fetch task counts (Completed, Pending, Expired)
async function fetchTaskCounts(userId) {
  const tasksCompleted = document.getElementById("tasksCompleted");
  const tasksPending = document.getElementById("tasksPending");
  const tasksExpired = document.getElementById("tasksExpired");

  const taskQuery = query(
    collection(db, "tasks"),
    where("userId", "==", userId) // Fetch tasks for the logged-in user
  );

  const querySnapshot = await getDocs(taskQuery);
  
  let completedCount = 0;
  let pendingCount = 0;
  let expiredCount = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to 00:00 to compare dates

  // Categorize tasks based on their status
  querySnapshot.forEach((docSnapshot) => {
    const task = docSnapshot.data();
    const taskDate = new Date(task.date);
    
    // Determine the task's status
    if (task.done) {
      completedCount++;
    } else if (taskDate < today) {
      expiredCount++;
    } else {
      pendingCount++;
    }
  });

  // Display the task counts in the profile section
  tasksCompleted.innerHTML = `Complete: <strong>${completedCount}</strong>`;
  tasksPending.innerHTML = `Tasks Pending: <strong>${pendingCount}</strong>`;
  tasksExpired.innerHTML = `Tasks Expired: <strong>${expiredCount}</strong>`;
}

// Logout functionality
const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth); // Sign out the user
      alert("You have been logged out.");
      window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error during logout.");
    }
  });
}

// Delete Account functionality
const deleteButton = document.getElementById("deleteAccount");

if (deleteButton) {
  deleteButton.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmDelete) return;

    const user = auth.currentUser;

    if (user) {
      const email = user.email;
      const password = prompt("Please enter your password to confirm:");

      if (!password) {
        alert("Password is required to delete your account.");
        return;
      }

      const credential = EmailAuthProvider.credential(email, password);

      try {
        // Step 1: Re-authenticate the user
        await reauthenticateWithCredential(user, credential);

        // Step 2: Delete the user's Firestore document
        const userDocRef = doc(db, "users", user.uid);
        await deleteDoc(userDocRef);

        // Step 3: Delete the Firebase Auth user
        await deleteUser(user);

        alert("Your account has been deleted.");
        window.location.href = "signup.html"; // Redirect to signup page
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. " + error.message);
      }
    }
  });
}
