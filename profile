// import { auth, db } from "./firebase.js";
// import {
//   onAuthStateChanged,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// import {
//   doc,
//   getDoc,
// } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     const fullNameElement = document.getElementById("fullName");
//     const emailElements = document.querySelectorAll(".email");
//     const displayName = document.getElementById("displayName");
//     const joinedSinceElement = document.getElementById("joinedSince");
//     const lastActiveElement = document.getElementById("lastActive");
//     const userIDElement = document.getElementById("userID");

//     try {
//       const docRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const userData = docSnap.data();
//         const firstName = userData.firstName;
//         const lastName = userData.lastName;
//         const email = userData.email;
//         const createdAt = userData.createdAt;
//         const lastActive = userData.lastActive;

//         // Capitalize first letter of firstName and lastName
//         const capitalizedFirstName =
//           firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
//         const capitalizedLastName =
//           lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
//         const capitalizedEmail =
//           email.charAt(0).toUpperCase() + email.slice(1).toLowerCase();

//         // Format the createdAt date
//         const dateObj = createdAt.toDate();
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         const formattedDate = dateObj.toLocaleDateString("en-US", options);

//         // Format the lastActive date
//         const lastActiveDate = lastActive ? lastActive.toDate() : new Date();
//         const formattedLastActive = lastActiveDate.toLocaleDateString(
//           "en-US",
//           options
//         );

//         // Display user information in HTML
//         fullNameElement.textContent = `Welcome, ${capitalizedLastName}, ${capitalizedFirstName}`;
//         emailElements.forEach((el) => {
//           el.textContent = `Email: ${capitalizedEmail}`;
//         });
//         displayName.textContent = `Name: ${capitalizedFirstName} ${capitalizedLastName}`;
//         joinedSinceElement.innerHTML = `Joined Since: <strong>${formattedDate}</strong>`;
//         lastActiveElement.innerHTML = `Last Active: <strong>${formattedLastActive}</strong>`;
//         userIDElement.textContent = `ID: ${user.uid}`;
//         // Log the data to the console
//         console.log("First Name:", capitalizedFirstName);
//         console.log("Last Name:", capitalizedLastName);
//         console.log("Email:", capitalizedEmail);
//         console.log(`Join since: ${formattedDate}`);
//         console.log(`Last Active: ${formattedLastActive}`);
//       } else {
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.error("Error getting user data:", error);
//     }
//   }
// });

// const logoutButton = document.getElementById("logout");

// logoutButton.addEventListener("click", async () => {
//   try {
//     await signOut(auth);
//     alert("You have been logged out");
//     window.location.href = "login.html";
//   } catch (error) {
//     alert("Error logging out. Please try again.", error.message);
//   }
// });
