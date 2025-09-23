import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [dark, setDark] = useState(false)

  const API = "http://localhost:5000/api/tasks"

  // Fetch tasks dari backend saat load
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  // Tambah task
  const addTask = () => {
    if (!newTask.trim()) return
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask.trim() })
    })
      .then(res => res.json())
      .then(task => setTasks([task, ...tasks]))
    setNewTask("")
  }

  // Hapus task
  const deleteTask = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
  }

  // Toggle done
  const toggleTask = (id) => {
    fetch(`${API}/${id}/toggle`, { method: "PUT" })
      .then(res => res.json())
      .then(updated => setTasks(tasks.map(t => t.id === id ? updated : t)))
  }

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <header>
        <h1>📋 ToDo List</h1>
        <button onClick={() => setDark(!dark)} className="mode-btn">
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="input-box">
        <input
          type="text"
          placeholder="Tulis tugas baru..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>➕</button>
      </div>

      <main>
        {tasks.length === 0 && <p className="empty">Belum ada tugas 💤</p>}
        {tasks.map(task => (
          <div key={task.id} className={`task ${task.done ? "done" : ""}`}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.text}</span>
            </label>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App
