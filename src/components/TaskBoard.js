import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { selectTasksByStatus, moveTask } from '../redux/tasksSlice';
import '../styles/TaskBoard.css';

const TaskBoard = () => {
  const dispatch = useDispatch();
  
  const todoTasks = useSelector(state => selectTasksByStatus(state, 'todo'));
  const inProgressTasks = useSelector(state => selectTasksByStatus(state, 'inProgress'));
  const doneTasks = useSelector(state => selectTasksByStatus(state, 'done'));

  const columns = [
    { id: 'todo', title: 'To Do', tasks: todoTasks, color: '#e74c3c' },
    { id: 'inProgress', title: 'In Progress', tasks: inProgressTasks, color: '#f39c12' },
    { id: 'done', title: 'Done', tasks: doneTasks, color: '#27ae60' },
  ];

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If moved to a different column
    if (destination.droppableId !== source.droppableId) {
      dispatch(moveTask({
        id: draggableId,
        newStatus: destination.droppableId,
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="task-board">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
