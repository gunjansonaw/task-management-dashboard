import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tasksAPI = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Update task status (for drag-and-drop)
  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}`, { status });
    return response.data;
  },
};

export default api;
