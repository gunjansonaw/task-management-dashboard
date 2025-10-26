# Task Management Dashboard

A modern, responsive task management dashboard built with React, Redux Toolkit, and drag-and-drop functionality.

## Features

- ✅ **Add, Update, Delete Tasks**: Full CRUD operations for task management
- 🎯 **Drag-and-Drop**: Move tasks between columns (To Do, In Progress, Done) using react-beautiful-dnd
- 🔄 **Redux State Management**: Global state management with Redux Toolkit
- 💾 **REST API Integration**: Persistent data storage using JSON Server
- 📱 **Responsive Design**: CSS Grid-based layout that works on all devices
- 🎨 **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **Frontend**: React 18
- **State Management**: Redux Toolkit
- **Drag-and-Drop**: react-beautiful-dnd
- **API**: JSON Server (REST API)
- **Styling**: CSS Grid & Flexbox
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the JSON Server (backend):
```bash
npm run server
```
This will start the API server on `http://localhost:5000`

3. In a new terminal, start the React app:
```bash
npm start
```
This will open the app at `http://localhost:3000`

## Project Structure

```
task-management-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TaskBoard.js
│   │   ├── TaskColumn.js
│   │   ├── TaskCard.js
│   │   ├── TaskForm.js
│   │   └── TaskModal.js
│   ├── redux/
│   │   ├── store.js
│   │   └── tasksSlice.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── TaskBoard.css
│   │   ├── TaskCard.css
│   │   └── TaskForm.css
│   ├── App.js
│   └── index.js
├── db.json
└── package.json
```

## Usage

### Adding a Task
1. Click the "Add New Task" button
2. Fill in the task details (title, description, priority)
3. Click "Create Task"

### Moving Tasks
- Drag and drop tasks between columns to change their status
- Tasks can be moved between: To Do → In Progress → Done

### Editing a Task
1. Click on a task card
2. Modify the task details
3. Click "Update Task"

### Deleting a Task
- Click the delete button (×) on any task card

## API Endpoints

The JSON Server provides the following REST API endpoints:

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## License

MIT
