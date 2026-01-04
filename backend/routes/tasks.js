const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/tasks.json");

// 👉 Funciones auxiliares
const readTasks = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// 🟢 GET /tasks - listar tareas
router.get("/", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// 🟢 POST /tasks - crear tarea
router.post("/", (req, res) => {
  const tasks = readTasks();
  const { title, description } = req.body;

  const newTask = {
    id: Date.now(),
    title,
    description,
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// 🟡 PUT /tasks/:id - editar tarea
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Body requerido" });
  }

  const { title, description, completed } = req.body;
  const id = Number(req.params.id);

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title ?? tasks[taskIndex].title,
    description: description ?? tasks[taskIndex].description,
    completed: completed ?? tasks[taskIndex].completed
  };

  writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// 🔴 DELETE /tasks/:id - eliminar tarea
router.delete("/:id", (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);

  const filteredTasks = tasks.filter(t => t.id !== id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  writeTasks(filteredTasks);
  res.json({ message: "Tarea eliminada" });
});

module.exports = router;