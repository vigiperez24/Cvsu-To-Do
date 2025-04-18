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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelBtn = document.getElementById("cancelBtn");
const openBtn = document.getElementById("openBtn");
const modal = document.querySelector(".bg-opacity");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");
const noTask = document.getElementById("no-task");

// Open modal
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Cancel modal
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskId").value = "";
  errorMessage.textContent = "";
  addTaskBtn.textContent = "Add";
});

// Add or update task
addTaskBtn.addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const date = document.getElementById("taskDate").value;
  const taskId = document.getElementById("taskId").value;

  if (!title || !description || !date) {
    errorMessage.textContent = "Please fill in all fields.";
    return;
  }

  if (title.length > 30) {
    errorMessage.textContent = "Title must not exceed 30 characters.";
    return;
  }

  try {
    if (taskId) {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { title, description, date });
      alert("Task updated!");
    } else {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        date,
        createdAt: serverTimestamp(),
        done: false,
      });
      alert("Task added!");
    }

    // Clear form
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskId").value = "";
    errorMessage.textContent = "";
    addTaskBtn.textContent = "Add";
    modal.style.display = "none";
    fetchTasks();
  } catch (error) {
    console.error("Error saving task:", error);
    errorMessage.textContent = "Failed to save task.";
  }
});

// Fetch tasks
async function fetchTasks() {
  taskList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "tasks"));

  let hasVisibleTasks = false;

  querySnapshot.forEach((docSnapshot) => {
    const task = docSnapshot.data();
    const id = docSnapshot.id;

    if (task.done) return;

    hasVisibleTasks = true;

    const taskItem = document.createElement("div");
    taskItem.classList.add("myTask");

    taskItem.innerHTML = `
    <div class = "taskContainer">
        <div class="title-date">
        <p>${task.title}</p>
        <p class="description">${task.description}</p>
        <span>${task.date}</span>
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

    taskList.appendChild(taskItem);
  });

  noTask.style.display = hasVisibleTasks ? "none" : "block";

  setupButtons();
}

// Setup buttons
function setupButtons() {
  const doneBtns = document.querySelectorAll(".doneBtn");
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  const editBtns = document.querySelectorAll(".editBtn");

  // Done
  doneBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { done: true });
      alert("Task marked as done!");
      fetchTasks();
    });
  });

  // Delete
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        const taskRef = doc(db, "tasks", id);
        await deleteDoc(taskRef);
        alert("Task deleted!");
        fetchTasks();
      }
    });
  });

  // Edit ✅ (FIXED)
  editBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const taskId = btn.getAttribute("data-id");
      const taskRef = doc(db, "tasks", taskId);

      try {
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          const taskData = taskSnap.data();
          document.getElementById("taskTitle").value = taskData.title;
          document.getElementById("taskDescription").value =
            taskData.description;
          document.getElementById("taskDate").value = taskData.date;
          document.getElementById("taskId").value = taskId;

          addTaskBtn.textContent = "Update";
          modal.style.display = "block";
        }
      } catch (error) {
        console.error("Error loading task for editing:", error);
      }
    });
  });
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", fetchTasks);
