import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksAPI } from '../services/api';

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await tasksAPI.getAllTasks();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: taskData.status || 'todo',
      };
      const data = await tasksAPI.createTask(newTask);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const data = await tasksAPI.updateTask(id, taskData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await tasksAPI.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete task');
    }
  }
);

export const moveTask = createAsyncThunk(
  'tasks/moveTask',
  async ({ id, newStatus }, { getState, rejectWithValue }) => {
    try {
      const task = getState().tasks.items.find(t => t.id === id);
      const updatedTask = { ...task, status: newStatus };
      const data = await tasksAPI.updateTask(id, updatedTask);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to move task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Move task
      .addCase(moveTask.pending, (state) => {
        state.error = null;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksByStatus = (state, status) =>
  state.tasks.items.filter(task => task.status === status);
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

export default tasksSlice.reducer;
