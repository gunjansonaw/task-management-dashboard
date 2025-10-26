# Task Management Dashboard - System Architecture Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [System Layers](#system-layers)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Data Flow](#data-flow)
7. [Detailed Code Explanation](#detailed-code-explanation)
8. [Design Patterns](#design-patterns)

---

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    REACT APPLICATION                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           PRESENTATION LAYER                        │  │  │
│  │  │  - App.js (Root Component)                          │  │  │
│  │  │  - TaskBoard, TaskColumn, TaskCard                  │  │  │
│  │  │  - TaskModal, TaskForm                              │  │  │
│  │  │  - react-beautiful-dnd (Drag & Drop)                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↕                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           STATE MANAGEMENT LAYER                    │  │  │
│  │  │  - Redux Store (configureStore)                     │  │  │
│  │  │  - Tasks Slice (createSlice)                        │  │  │
│  │  │  - Async Thunks (createAsyncThunk)                  │  │  │
│  │  │  - Selectors                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↕                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              SERVICE LAYER                          │  │  │
│  │  │  - Axios HTTP Client                                │  │  │
│  │  │  - API Abstraction (tasksAPI)                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              BACKEND LAYER (JSON Server)                  │  │
│  │  - RESTful API Endpoints                                  │  │
│  │  - Request Routing                                        │  │
│  │  - CRUD Operations                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↕                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              DATA LAYER (File System)                     │  │
│  │  - db.json (JSON Database)                                │  │
│  │  - Task Records Storage                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Layers

### 1. Presentation Layer (React Components)

**Purpose:** Render UI and handle user interactions

**Components Hierarchy:**
```
src/
├── index.js                    # Application entry point
├── App.js                      # Root component
└── components/
    ├── TaskBoard.js            # Main board with drag-drop context
    ├── TaskColumn.js           # Individual status columns
    ├── TaskCard.js             # Task card with drag capability
    ├── TaskModal.js            # Modal wrapper component
    └── TaskForm.js             # Form for create/edit tasks
```

**Responsibilities:**
- Render visual elements
- Handle user events (clicks, drags, form submissions)
- Connect to Redux store via hooks
- Display loading states and errors

---

### 2. State Management Layer (Redux Toolkit)

**Purpose:** Centralized application state management

**Structure:**
```
src/redux/
├── store.js                    # Redux store configuration
└── tasksSlice.js              # Tasks state slice with reducers
```

**State Shape:**
```javascript
{
  tasks: {
    items: [                    // Array of task objects
      {
        id: "1",
        title: "Task title",
        description: "Description",
        status: "todo",
        priority: "high",
        createdAt: "2024-01-15T10:00:00.000Z"
      }
    ],
    loading: false,             // API request loading state
    error: null                 // Error messages
  }
}
```

---

### 3. Service Layer (API Client)

**Purpose:** Abstract HTTP communication with backend

**Structure:**
```
src/services/
└── api.js                      # Axios client and API methods
```

**API Methods:**
- `getAllTasks()` - Fetch all tasks
- `getTaskById(id)` - Fetch single task
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update task
- `deleteTask(id)` - Delete task
- `updateTaskStatus(id, status)` - Update task status

---

### 4. Backend Layer (JSON Server)

**Purpose:** RESTful API server for data operations

**Endpoints:**
```
GET    /tasks           # Fetch all tasks
GET    /tasks/:id       # Fetch single task
POST   /tasks           # Create new task
PUT    /tasks/:id       # Update entire task
PATCH  /tasks/:id       # Partial update
DELETE /tasks/:id       # Delete task
```

**Features:**
- Auto-generated REST API
- CRUD operations
- JSON file-based storage
- No configuration required

---

### 5. Data Layer (JSON Database)

**File:** `db.json`

**Structure:**
```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Design Homepage",
      "description": "Create wireframes and mockups",
      "status": "todo",
      "priority": "high",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Component Architecture

### Component Tree

```
<Provider store={store}>                    # Redux Provider
  <App>                                     # Root Component
    <header>
      <h1>Task Management Dashboard</h1>
      <button onClick={openModal}>          # Add Task Button
    </header>
    
    <main>
      <TaskBoard>                           # Main Board
        <DragDropContext onDragEnd={...}>   # Drag-Drop Context
          <TaskColumn id="todo">            # To Do Column
            <Droppable droppableId="todo">
              <TaskCard task={...} />       # Draggable Task
              <TaskCard task={...} />
            </Droppable>
          </TaskColumn>
          
          <TaskColumn id="inProgress">      # In Progress Column
            <Droppable droppableId="inProgress">
              <TaskCard task={...} />
            </Droppable>
          </TaskColumn>
          
          <TaskColumn id="done">            # Done Column
            <Droppable droppableId="done">
              <TaskCard task={...} />
            </Droppable>
          </TaskColumn>
        </DragDropContext>
      </TaskBoard>
    </main>
    
    {isModalOpen && (
      <TaskModal onClose={...}>             # Modal Overlay
        <TaskForm task={...} />             # Create/Edit Form
      </TaskModal>
    )}
  </App>
</Provider>
```

---

## State Management

### Redux Toolkit Architecture

#### Store Configuration (`store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,              // Register tasks slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,       // Disable for Date objects
    }),
});
```

**Explanation:**
- `configureStore`: Redux Toolkit's store setup function
- Automatically includes Redux DevTools
- Combines middleware (thunk included by default)
- `serializableCheck: false`: Allows non-serializable values like Dates

---

#### Tasks Slice (`tasksSlice.js`)

**1. Async Thunks (API Actions)**

```javascript
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',                     // Action type prefix
  async (_, { rejectWithValue }) => {     // Payload creator
    try {
      const data = await tasksAPI.getAllTasks();
      return data;                        // Fulfilled payload
    } catch (error) {
      return rejectWithValue(error.response?.data);  // Rejected payload
    }
  }
);
```

**Explanation:**
- `createAsyncThunk`: Generates pending/fulfilled/rejected actions
- Automatically dispatches lifecycle actions
- Handles async operations (API calls)
- Error handling with `rejectWithValue`

**Lifecycle Actions Generated:**
- `tasks/fetchTasks/pending` - Request started
- `tasks/fetchTasks/fulfilled` - Request succeeded
- `tasks/fetchTasks/rejected` - Request failed

---

**2. Slice Definition**

```javascript
const tasksSlice = createSlice({
  name: 'tasks',                          // Slice name
  initialState: {
    items: [],                            // Tasks array
    loading: false,                       // Loading state
    error: null,                          // Error message
  },
  reducers: {
    clearError: (state) => {              // Synchronous action
      state.error = null;
    },
  },
  extraReducers: (builder) => {           // Handle async actions
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;     // Update tasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;     // Set error
      });
  },
});
```

**Explanation:**
- `createSlice`: Generates action creators and reducers
- Uses Immer for immutable updates (can write "mutating" code)
- `reducers`: Synchronous actions
- `extraReducers`: Handle external actions (thunks)
- `builder.addCase`: Type-safe action handling

---

**3. Selectors**

```javascript
export const selectAllTasks = (state) => state.tasks.items;

export const selectTasksByStatus = (state, status) =>
  state.tasks.items.filter(task => task.status === status);

export const selectTasksLoading = (state) => state.tasks.loading;

export const selectTasksError = (state) => state.tasks.error;
```

**Explanation:**
- Selectors extract specific data from state
- Encapsulate state shape knowledge
- Can be memoized for performance (using `reselect`)
- Used in components with `useSelector` hook

---

## API Integration

### Axios Client Setup (`api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Explanation:**
- `axios.create`: Creates configured instance
- `baseURL`: Prepended to all requests
- `headers`: Default headers for all requests

---

### API Methods

```javascript
export const tasksAPI = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
```

**Explanation:**
- Encapsulates all API calls
- Returns only `response.data` (not full response)
- Async/await for clean asynchronous code
- Centralized error handling point

---

## Data Flow

### Complete Data Flow Example: Adding a Task

```
1. USER ACTION
   User clicks "Add New Task" button
   ↓
2. UI EVENT HANDLER
   setIsModalOpen(true) → Modal opens
   ↓
3. FORM SUBMISSION
   TaskForm.handleSubmit(formData)
   ↓
4. DISPATCH REDUX ACTION
   dispatch(addTask(formData))
   ↓
5. REDUX THUNK EXECUTES
   - Dispatch: addTask.pending
   - State: loading = true
   ↓
6. API CALL
   tasksAPI.createTask(data)
   → axios.post('http://localhost:5000/tasks', data)
   ↓
7. JSON SERVER PROCESSES
   - Receives POST request
   - Generates ID
   - Writes to db.json
   - Returns created task
   ↓
8. RESPONSE RECEIVED
   - Dispatch: addTask.fulfilled
   - Payload: { id, title, description, ... }
   ↓
9. REDUX STATE UPDATE
   - state.loading = false
   - state.items.push(newTask)
   ↓
10. REACT RE-RENDER
    - useSelector detects state change
    - Components re-render
    - New TaskCard appears in column
    ↓
11. UI UPDATE COMPLETE
    - Modal closes
    - User sees new task on board
```

---

## Detailed Code Explanation

See the companion file `CODE_EXPLANATION.md` for detailed line-by-line explanations of each component.

---

## Design Patterns

### 1. Container/Presentational Pattern
- **Container Components**: Connect to Redux (TaskBoard, TaskCard)
- **Presentational Components**: Pure UI (TaskColumn, TaskModal)

### 2. Compound Components Pattern
- TaskBoard contains TaskColumn
- TaskColumn contains TaskCard
- Hierarchical composition

### 3. Render Props Pattern
- Used by react-beautiful-dnd
- Droppable and Draggable use render props
- Provides drag state and props

### 4. Higher-Order Component (HOC) Pattern
- Redux Provider wraps entire app
- Provides store context to all components

### 5. Custom Hooks Pattern
- useSelector: Subscribe to Redux state
- useDispatch: Get dispatch function
- useState: Local component state
- useEffect: Side effects and lifecycle

### 6. Flux Architecture
- Unidirectional data flow
- Actions → Reducers → State → View
- Predictable state updates

### 7. Repository Pattern
- API service layer abstracts data access
- Components don't know about HTTP details
- Easy to swap implementations

### 8. Observer Pattern
- Redux store notifies subscribers
- Components re-render on state changes
- Automatic UI updates

---

## Performance Optimizations

### 1. Selector Memoization
```javascript
// Selectors can be memoized with reselect
import { createSelector } from '@reduxjs/toolkit';

export const selectTasksByStatus = createSelector(
  [state => state.tasks.items, (state, status) => status],
  (items, status) => items.filter(task => task.status === status)
);
```

### 2. React.memo for Components
```javascript
// Prevent unnecessary re-renders
export default React.memo(TaskCard);
```

### 3. useCallback for Event Handlers
```javascript
const handleDelete = useCallback((id) => {
  dispatch(deleteTask(id));
}, [dispatch]);
```

### 4. Code Splitting
```javascript
// Lazy load components
const TaskBoard = React.lazy(() => import('./components/TaskBoard'));
```

---

## Security Considerations

### 1. Input Validation
- Form validation in TaskForm
- Prevent XSS attacks
- Sanitize user input

### 2. API Security
- CORS configuration
- Rate limiting (for production)
- Authentication tokens (if needed)

### 3. Error Handling
- Try-catch blocks in thunks
- Error boundaries in React
- User-friendly error messages

---

## Testing Strategy

### 1. Unit Tests
- Test Redux reducers
- Test selectors
- Test utility functions

### 2. Component Tests
- Test component rendering
- Test user interactions
- Test prop handling

### 3. Integration Tests
- Test Redux integration
- Test API calls
- Test drag-and-drop

### 4. E2E Tests
- Test complete user flows
- Test CRUD operations
- Test drag-and-drop workflows

---

## Scalability Considerations

### 1. State Management
- Can add more slices for features
- Normalize state shape for large datasets
- Use Redux Toolkit Query for caching

### 2. Component Structure
- Atomic design principles
- Reusable component library
- Shared component folder

### 3. API Layer
- Replace JSON Server with real backend
- Add authentication
- Implement pagination

### 4. Performance
- Virtual scrolling for large lists
- Debounce search/filter
- Optimize re-renders

---

## Deployment Architecture

```
Development:
- React Dev Server (localhost:3000)
- JSON Server (localhost:5000)

Production:
- Static React Build → CDN/Nginx
- Backend API → Node.js/Express
- Database → PostgreSQL/MongoDB
- Hosting → AWS/Vercel/Netlify
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| UI Framework | React | 18.2.0 | Component-based UI |
| State Management | Redux Toolkit | 2.0.1 | Global state |
| Drag-Drop | react-beautiful-dnd | 13.1.1 | Task movement |
| HTTP Client | Axios | 1.6.2 | API calls |
| Backend | JSON Server | 0.17.4 | REST API |
| Styling | CSS Grid/Flexbox | - | Layout |
| Build Tool | React Scripts | 5.0.1 | Build/Dev server |

---

## Conclusion

This architecture provides:
- ✅ **Separation of Concerns**: Clear layer boundaries
- ✅ **Scalability**: Easy to add features
- ✅ **Maintainability**: Well-organized code
- ✅ **Testability**: Isolated components and logic
- ✅ **Performance**: Optimized rendering
- ✅ **Developer Experience**: Modern tooling

The system follows React and Redux best practices while maintaining simplicity and clarity.
