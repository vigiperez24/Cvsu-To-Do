// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA6nhXjrNVLXc2ZrRQtWAIb8fH-OKQYic",
  authDomain: "cvsu-to-do-fda9a.firebaseapp.com",
  projectId: "cvsu-to-do-fda9a",
  storageBucket: "cvsu-to-do-fda9a.appspot.com",
  messagingSenderId: "831938988582",
  appId: "1:831938988582:web:8e957ce70aa358e1f7b4e7",
  measurementId: "G-W30F99SD5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Containers for pending, completed, and expired tasks
const pendingContainer = document.getElementById("pending-container");
const completeContainer = document.getElementById("complete-container");
const expiredContainer = document.getElementById("expired-container");

// Function to render a task to the appropriate container
const renderTask = (taskData, container, isComplete = false) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = `myTask${isComplete ? " myTask-done" : ""}`;
  
    // Format the task creation date
    const createdAt = taskData.createdAt ? taskData.createdAt.toDate() : null;
    const formattedCreatedAt = createdAt ? createdAt.toLocaleDateString() : "Unknown";
  
    // Format the task due date
    const dueDate = taskData.date ? new Date(taskData.date) : null;
    const formattedDueDate = dueDate ? dueDate.toLocaleDateString() : "Not set";
  
    // Prepare the status label and color (Pending/Expired)
    const statusSpan = document.createElement("span");
    let statusText = "";
    let statusColor = "";
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to compare dates only
  
    // Set task status based on its completion and due date
    if (isComplete) {
      statusText = ""; // No label if task is completed
    } else if (dueDate && dueDate < today) {
      statusText = "Expired";
      statusColor = "red";
    } else {
      statusText = "Pending";
      statusColor = "goldenrod";
    }
  
    statusSpan.textContent = statusText;
    statusSpan.style.color = statusColor;
  
    // Task HTML structure with date, status, and a delete button
    taskDiv.innerHTML = `
      <div class="title-date">
        <p class="${isComplete ? 'completed' : ''}">${taskData.title}</p>
        <p class="description ${isComplete ? 'completed' : ''}">${taskData.description}</p>
        <span>Created At: ${formattedCreatedAt}</span><br>
        <span>Due Date: ${formattedDueDate} </span>
      </div>
      <button class="deleteBtn" data-id="${taskData.id}">
        <img src="/images/defaultIcon/delete.svg" alt="Delete" />
      </button>
    `;
  
    // Insert the statusSpan after the "Due Date" span
    const titleDateDiv = taskDiv.querySelector(".title-date");
    titleDateDiv.appendChild(document.createElement("br"));
    titleDateDiv.appendChild(statusSpan);
  
    // Attach event listener for task deletion
    const deleteBtn = taskDiv.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", async () => {
      try {
        await deleteDoc(doc(db, "tasks", taskData.id));
        taskDiv.remove(); // Remove the task from the UI
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    });
  
    // Append the task div to the appropriate container
    container.appendChild(taskDiv);
};

// Auth state listener to manage user tasks
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId)); // Query tasks for the logged-in user
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const task = doc.data();
        task.id = doc.id;
      
        const isComplete = task.done;
      
        // Render task based on its completion status
        if (isComplete) {
          renderTask(task, completeContainer, true); // Add to complete container
        } else {
          const dueDate = task.date ? new Date(task.date) : null;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize date for comparison
      
          // Add task to expired, pending, or completed container
          if (dueDate && dueDate < today) {
            renderTask(task, expiredContainer); // Add to expired container
          } else {
            renderTask(task, pendingContainer); // Add to pending container
          }
        }
    });
  } else {
    // If no user is logged in, redirect to the login page
    window.location.href = "login.html";
  }
});
