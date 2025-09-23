import { useState } from "react"
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [dark, setDark] = useState(false)

  const addTask = () => {
    if (!title.trim()) return
    const newTask = {
      id: Date.now(),
      text: title,
      done: false,
      color: ["blue", "green", "yellow"][Math.floor(Math.random() * 3)]
    }
    setTasks([newTask, ...tasks])
    setTitle("")
  }

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <header>
        <h1>📋 My Tasks</h1>
        <button onClick={() => setDark(!dark)} className="mode-btn">
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="input-box">
        <input
          type="text"
          placeholder="Tambahkan tugas..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>➕</button>
      </div>

      <main className="task-grid">
        {tasks.length === 0 && <p className="empty">Belum ada tugas 💤</p>}

        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.color} ${task.done ? "done" : ""}`}>
            <h3>{task.text}</h3>
            <div className="actions">
              <button onClick={() => toggleDone(task.id)}>
                {task.done ? "✅" : "⭕"}
              </button>
              <button onClick={() => removeTask(task.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App
