import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// POST add task
app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Teks tugas kosong" });
  const task = { id: Date.now(), text, done: false };
  tasks.push(task);
  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

// TOGGLE done
app.put("/api/tasks/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  const updatedTask = tasks.find(t => t.id === id);
  res.json(updatedTask);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
