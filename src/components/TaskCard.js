import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { deleteTask } from '../redux/tasksSlice';
import TaskModal from './TaskModal';
import '../styles/TaskCard.css';

const TaskCard = ({ task, index }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
            onClick={() => setIsModalOpen(true)}
          >
            <div className="task-card-header">
              <span
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
              <button
                className="delete-btn"
                onClick={handleDelete}
                aria-label="Delete task"
              >
                ×
              </button>
            </div>
            
            <h3 className="task-title">{task.title}</h3>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-footer">
              <span className="task-date">
                📅 {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        )}
      </Draggable>

      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
