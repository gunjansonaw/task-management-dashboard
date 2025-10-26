import React from 'react';
import TaskForm from './TaskForm';

const TaskModal = ({ task, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <TaskForm task={task} onClose={onClose} />
      </div>
    </div>
  );
};

export default TaskModal;
