// frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskManager from "./TaskManager.tsx";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const response = await axios.get("http://127.0.0.1:5000/tasks");
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;
    await axios.post("http://127.0.0.1:5000/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`http://127.0.0.1:5000/tasks/${task.id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <TaskManager />  );
}

export default App;
