import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../redux/tasksSlice';
import '../styles/TaskForm.css';

const TaskForm = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      if (task) {
        // Update existing task
        await dispatch(updateTask({
          id: task.id,
          taskData: {
            ...task,
            ...formData,
          },
        })).unwrap();
      } else {
        // Create new task
        await dispatch(addTask(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows="4"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {errors.submit && (
        <div className="error-message submit-error">{errors.submit}</div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
