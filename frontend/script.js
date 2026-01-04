const API_URL = "http://localhost:3000/tasks";

const tableBody = document.getElementById("tasks-table");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskIdInput = document.getElementById("task-id");

// 📌 Cargar tareas
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  tableBody.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>
        <input type="checkbox" ${task.completed ? "checked" : ""} 
          onchange="toggleCompleted(${task.id}, this.checked)">
      </td>
      <td>
        <button onclick="editTask(${task.id}, '${task.title}', '${task.description}')">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ➕ Crear o editar tarea
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = taskIdInput.value;
  const task = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
  }

  form.reset();
  taskIdInput.value = "";
  loadTasks();
});

// ✏️ Editar
function editTask(id, title, description) {
  taskIdInput.value = id;
  titleInput.value = title;
  descriptionInput.value = description;
}

// ❌ Eliminar
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  loadTasks();
}

// ✅ Marcar completada
async function toggleCompleted(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}

// Inicializar
loadTasks();