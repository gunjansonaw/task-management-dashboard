import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ columnId, title, tasks, color }) => {
  return (
    <div className="task-column">
      <div className="column-header" style={{ borderTopColor: color }}>
        <h2>{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {tasks.length === 0 ? (
              <div className="empty-column">
                <p>No tasks yet</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
