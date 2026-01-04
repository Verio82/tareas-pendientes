const express = require("express");
const cors = require("cors");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/tasks", tasksRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});