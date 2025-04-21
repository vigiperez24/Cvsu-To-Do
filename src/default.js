import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
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
  measurementId: "G-W30F99SD5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelBtn = document.getElementById("cancelBtn");
const openBtn = document.getElementById("openBtn");
const modal = document.querySelector(".bg-opacity");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");
const noTask = document.getElementById("no-task");

// Open modal function to display the modal when the open button is clicked
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Cancel modal function to close the modal when the cancel button is clicked
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  resetTaskForm(); // Reset the task form fields
});

// Reset task form function to clear all input fields in the modal
function resetTaskForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskId").value = "";
  errorMessage.textContent = ""; // Clear any error message
  addTaskBtn.textContent = "Add"; // Reset button text to "Add"
}

// Add or update task function to handle adding a new task or updating an existing one
addTaskBtn.addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const date = document.getElementById("taskDate").value;
  const taskId = document.getElementById("taskId").value;

  // Validate task inputs
  if (!title || !description || !date) {
    errorMessage.textContent = "Please fill in all fields.";
    return;
  }

  if (title.length > 30) {
    errorMessage.textContent = "Title must not exceed 30 characters.";
    return;
  }

  const selectedDate = new Date(date);
  const setToday = new Date();
  setToday.setHours(0, 0, 0, 0); // Set today's date to midnight for comparison

  if (selectedDate < setToday) {
    alert("Invalid date. Please select a date today or in the future.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add tasks.");
      return;
    }

    // If taskId is present, update existing task, otherwise add a new task
    if (taskId) {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { title, description, date });
      alert("Task updated!");
    } else {
      // Add a new task to Firestore
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        date,
        createdAt: serverTimestamp(), // Automatically set timestamp when the task is created
        done: false, // Initial task status is not done
        userId: user.uid, // Associate task with the logged-in user
      });
      alert("Task added!");
    }

    resetTaskForm();
    modal.style.display = "none"; // Close the modal after adding/updating task
    fetchTasks(); // Refresh task list
  } catch (error) {
    console.error("Error saving task:", error);
    errorMessage.textContent = "Failed to save task."; // Display error message if something goes wrong
  }
});

// Fetch tasks function to retrieve tasks for the current user
async function fetchTasks() {
  const user = auth.currentUser;
  if (!user) return; // If no user is logged in, don't fetch tasks

  taskList.innerHTML = ""; // Clear existing tasks
  const querySnapshot = await getDocs(collection(db, "tasks"));
  let hasVisibleTasks = false;

  querySnapshot.forEach((docSnapshot) => {
    const task = docSnapshot.data();
    const id = docSnapshot.id;

    if (task.userId !== user.uid) return; // Only fetch tasks associated with the current user
    if (task.done) return; // Skip tasks that are marked as done

    hasVisibleTasks = true;

    const taskItem = createTaskItem(task, id);
    taskList.appendChild(taskItem);
  });

  noTask.style.display = hasVisibleTasks ? "none" : "block"; // Show "No tasks" message if no tasks are visible
  setupButtons(); // Set up action buttons (done, edit, delete)
}

// Create task item function to generate the HTML structure for each task
function createTaskItem(task, id) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("myTask");

  taskItem.innerHTML = `
    <div class="taskContainer">
      <div class="title-date">
        <p>${task.title}</p>
        <p class="description">${task.description}</p>
        <span>${task.date}</span>
        <span class="task-status"></span>
      </div>
      <div class="edit-delete">
        <button class="doneBtn" data-id="${id}">
          <img src="/images/defaultIcon/done.svg" alt="Done" />
        </button>
        <button class="editBtn" data-id="${id}">
          <img src="/images/defaultIcon/edit.svg" alt="Edit" />
        </button>
        <button class="deleteBtn" data-id="${id}">
          <img src="/images/defaultIcon/delete.svg" alt="Delete" />
        </button>
      </div>
    </div>
  `;

  const statusSpan = taskItem.querySelector(".task-status");
  const taskDate = new Date(task.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's date to midnight for comparison

  // Display task status based on the due date
  if (task.done) {
    statusSpan.textContent = "";
  } else if (taskDate < today) {
    statusSpan.textContent = "Expired";
    statusSpan.style.color = "red";
  } else {
    statusSpan.textContent = "Pending";
    statusSpan.style.color = "goldenrod";
  }

  return taskItem;
}

// Setup buttons function to set up event listeners for task action buttons
function setupButtons() {
  const doneBtns = document.querySelectorAll(".doneBtn");
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  const editBtns = document.querySelectorAll(".editBtn");

  // Mark task as done
  doneBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { done: true });
      alert("Task marked as done!");
      fetchTasks(); // Refresh task list
    });
  });

  // Delete task
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmDelete = confirm("Are you sure you want to delete this task?");
      if (confirmDelete) {
        const taskRef = doc(db, "tasks", id);
        await deleteDoc(taskRef);
        alert("Task deleted!");
        fetchTasks(); // Refresh task list
      }
    });
  });

  // Edit task
  editBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const taskId = btn.getAttribute("data-id");
      const taskRef = doc(db, "tasks", taskId);

      try {
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          const taskData = taskSnap.data();
          document.getElementById("taskTitle").value = taskData.title;
          document.getElementById("taskDescription").value = taskData.description;
          document.getElementById("taskDate").value = taskData.date;
          document.getElementById("taskId").value = taskId;

          addTaskBtn.textContent = "Update"; // Change button text to "Update" for editing
          modal.style.display = "block"; // Open the modal for editing
        }
      } catch (error) {
        console.error("Error loading task for editing:", error);
      }
    });
  });
}

// Fetch tasks only after user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    fetchTasks(); // Fetch tasks when user is logged in
  } else {
    alert("No user logged in");
    // Optional: redirect to login page if no user is logged in
  }
});
