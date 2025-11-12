import { useState, useEffect, useCallback } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
      throw err;
    }
  }, []);

  const searchTasks = useCallback(async (query) => {
    if (!query.trim()) {
      loadTasks();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const searchResults = await taskService.search(query);
      setTasks(searchResults);
    } catch (err) {
      console.error("Error searching tasks:", err);
      setError(err.message || "Failed to search tasks");
    } finally {
      setLoading(false);
    }
  }, [loadTasks]);

  const getTasksByCategory = useCallback((categoryName) => {
    if (categoryName === "all") {
      return tasks;
    }
    return tasks.filter(task => task.category === categoryName);
  }, [tasks]);

  const getTasksByStatus = useCallback((completed) => {
    return tasks.filter(task => task.completed === completed);
  }, [tasks]);

  const getTaskCounts = useCallback(() => {
    const counts = {
      all: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length
    };

    // Add category-specific counts
    const categoryCount = {};
    tasks.forEach(task => {
      categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
    });

    return { ...counts, ...categoryCount };
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    getTasksByCategory,
    getTasksByStatus,
    getTaskCounts
  };
};