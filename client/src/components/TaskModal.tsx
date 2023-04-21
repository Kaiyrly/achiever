import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { ITask, IToDoList, INumberType, IToDo } from '../types';
import { ModalComponent } from './ModalComponent';
import ToDoTypeView from './ToDoTypeView';
import { NumberTypeView } from './NumberTypeView';
import { updateCompletedTasks } from '../services/api';
import { CircularProgressbar } from 'react-circular-progressbar';
import { getUserIdFromToken } from '../helpers/index'
import useToken from '../hooks/useToken';

import { FaTrash } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/TaskModal.css';



interface TaskModalProps {
  item: ITask;
  onUpdateTask: (updatedTask: ITask) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}


export const TaskModal: React.FC<TaskModalProps> = ({ item, onUpdateTask, onDeleteTask }) => {
  const [showModal, setShowModal] = useState(false);    
  const { token } = useToken();
  const userId = getUserIdFromToken(token ?? '') ?? '';

  useEffect(() => {
    console.log(item);
  })


  const handleModalClose = async (updatedItem: ITask) => {
    if (updatedItem) {
      await onUpdateTask(updatedItem);
    }
    setShowModal(false);
  };

  const handleCloseForNumberType = (currentCount: number, goalCount: number) => {
    if (isNumberType(item.value)) {
      const taskComplete = currentCount >= goalCount;
      if(taskComplete !== item.taskComplete) updateCompletedTasks(userId, new Date(), taskComplete);
      handleModalClose({
        ...item,
        value: new INumberType(item.value.name, taskComplete, item.value.initialValue, currentCount, goalCount),
        taskComplete: taskComplete,
      });
    }
  };
  
  const handleCloseForToDoType = (todoList: IToDoList, todos: IToDo[]) => {
    if (isToDoList(item.value)) {
      const allTodosCompleted = todos.every(todo => todo.value === true);
      if(allTodosCompleted !== item.taskComplete) updateCompletedTasks(userId, new Date(), allTodosCompleted);
      handleModalClose({
        ...item,
        value: new IToDoList(todos),
        taskComplete: allTodosCompleted,
      });
    }
  };
  
  
  
  
  
  
  

  const handleDelete = async () => {
    await onDeleteTask(item.taskId);
  };

  

  const isToDoList = (value: IToDoList | INumberType): value is IToDoList => {
    return value instanceof IToDoList;
  };

  const isNumberType = (value: IToDoList | INumberType): value is INumberType => {
    return value instanceof INumberType;
  };

  const calculateCompletionPercentage = (task: ITask): number => {
    if (isNumberType(task.value)) {
      const progress = (task.value.currentValue / task.value.targetValue) * 100;
      return progress > 100 ? 100 : progress;
    } else if (isToDoList(task.value)) {
      const completedTodos = task.value.value.filter((todo) => todo.value === true);
      return (completedTodos.length / task.value.value.length) * 100;
    }
    return 0;
  };

  const completionPercentage = calculateCompletionPercentage(item);

  return (
    <>
      {showModal && (
        <ModalComponent
          setShowModal={setShowModal}
          title={item.name}
          onClose={handleModalClose}
          onSave={() => handleModalClose(item)}
        >
          {isToDoList(item.value) && (
            <ToDoTypeView item={item} taskId={item.taskId} onClose={handleCloseForToDoType} />
          )}
          {isNumberType(item.value) && (
            <NumberTypeView number={item.value} onClose={handleCloseForNumberType} />
          )}
        </ModalComponent>
      )}
      <a className="list-group-item list-group-item-action task-modal-item">
        <div className="task-modal-item-name">{item.name}</div>
        <div className="task-modal-buttons">
          <Button
            className="task-modal-button"
            variant="primary"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            Show task
          </Button>
          <Button
            className="task-modal-button"
            variant="secondary"
            size="sm"
            onClick={handleDelete}
          >
            <FaTrash />
          </Button>
          <div style={{ width: '60px', height: '60px', marginLeft: '10px' }}>
            <CircularProgressbar
              value={completionPercentage}
              text={`${Math.round(completionPercentage)}%`}
            />
          </div>
        </div>
      </a>
    </>
  );
  return <>default view</>;
};
