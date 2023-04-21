import React from 'react';
import { useEffect } from 'react';
import { ITask } from '../types';
import { TaskModal } from './TaskModal';

interface DisplayTaskListProps {
  taskList: ITask[];
  onUpdateTask: (updatedTask: ITask) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const DisplayTaskList: React.FC<DisplayTaskListProps> = ({ taskList, onUpdateTask, onDeleteTask }) => {
  return (
    <div className="list-group">
      {taskList.map((item, i) => (
        <div key={i}>
          <TaskModal item={item} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask}/>
        </div>
      ))}
    </div>
  );
};
