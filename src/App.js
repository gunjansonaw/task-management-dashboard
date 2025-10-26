import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import { fetchTasks } from './redux/tasksSlice';

function App() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Task Management Dashboard</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Task
        </button>
      </header>
      
      <main className="app-main">
        <TaskBoard />
      </main>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
