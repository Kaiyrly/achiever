import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { ITask, IToDoList, INumberType, IToDo, IBooleanType } from '../types';
import Card from 'react-bootstrap/Card';
import { CustomDropdownTaskCard } from './CustomDropdownTaskCard'; 
import { ModalComponent } from './ModalComponent';
import ToDoTypeView from './ToDoTypeView';
import { NumberTypeView } from './NumberTypeView';
import { BooleanTypeView } from './BooleanTypeView';
import { EditTaskForm } from './EditTaskForm';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [recurringT, setRecurringT] = useState(item.recurring);


  const handleEditModalShow = (value: boolean) => {
    setShowEditModal(value)
  } 


  const handleModalClose = async (updatedItem: ITask) => {
    if (updatedItem) {
      await onUpdateTask(updatedItem);
    }
    setShowModal(false);
  };

  const handleCloseForNumberType = (currentCount: number, goalCount: number, initialCount?: number) => {
    if (isNumberType(item.value)) {
      const taskComplete = item.value.initialValue > item.value.targetValue
        ? currentCount <= goalCount
        : currentCount >= goalCount;
      if(taskComplete !== item.taskComplete) updateCompletedTasks(userId, new Date(), taskComplete);
      handleModalClose({
        ...item,
        value: new INumberType(item.value.name, taskComplete, initialCount ?? item.value.initialValue, currentCount, goalCount),
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

  const handleCloseForBooleanType = (value: boolean) => {
    if (item.value instanceof IBooleanType) {
      const taskComplete = value;
      if(taskComplete !== item.taskComplete) updateCompletedTasks(userId, new Date(), taskComplete);
      handleModalClose({
        ...item,
        value: new IBooleanType(item.value.name, value),
        taskComplete: taskComplete,
      });
    }
  };
  
  
  const handleRecurringChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecurringT(event.target.checked);
    const updatedTask = {
      ...item,
      recurring: event.target.checked,
    };
    console.log(updatedTask)
    await onUpdateTask(updatedTask);
  };

  const handleDelete = async () => {
    await onDeleteTask(item.taskId);
  };

  const handleEdit = async (updatedTask: ITask) => {
    if(isToDoList(updatedTask.value)){
      handleCloseForToDoType(updatedTask.value, updatedTask.value.value)
    }
    if(isNumberType(updatedTask.value)){
      handleCloseForNumberType(updatedTask.value.currentValue, updatedTask.value.targetValue, updatedTask.value.initialValue)
    }
    if(isBooleanType(updatedTask.value)){
      handleCloseForBooleanType(updatedTask.value.value)
    }
    
    // await onUpdateTask(updatedTask);
    setShowEditModal(false);
  };
  

  const closeModal = () => {
    setShowEditModal(false);
  }
  


  const isToDoList = (value: IToDoList | INumberType | IBooleanType): value is IToDoList => {
    return value instanceof IToDoList;
  };

  const isNumberType = (value: IToDoList | INumberType | IBooleanType): value is INumberType => {
    return value instanceof INumberType;
  };

  const isBooleanType = (value: IToDoList | INumberType | IBooleanType): value is IBooleanType => {
    return value instanceof IBooleanType;
  }

  const calculateCompletionPercentage = (task: ITask): number => {
    if (isNumberType(task.value)) {
      const range = Math.abs(task.value.targetValue - task.value.initialValue);
      const currentProgress = task.value.initialValue > task.value.targetValue
        ? task.value.initialValue - task.value.currentValue
        : task.value.currentValue - task.value.initialValue;

      const progress = Math.max(0, Math.min(100, (currentProgress / range) * 100));

      return progress;
    }
    else if (isToDoList(task.value)) {
      const completedTodos = task.value.value.filter((todo) => todo.value === true);
      return (completedTodos.length / task.value.value.length) * 100;
    } 
    else if (isBooleanType(task.value)) {
      return task.value.value ? 100 : 0;
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
          {isBooleanType(item.value) && (
            <BooleanTypeView item={item.value} onClose={handleCloseForBooleanType} />
          )}

        </ModalComponent>
      )}
      {showEditModal && (
        <ModalComponent
          setShowModal={setShowEditModal}
          title={`Edit ${item.name}`}
          onClose={() => setShowEditModal(false)}
        >
          <EditTaskForm
            initialTask={item}
            editHandler={handleEdit}
            onCancel={closeModal}
          />
        </ModalComponent>
      )}

<div
  className="list-group-item list-group-item-action task-modal-item"
  onClick={() => {console.log(item); setShowModal(true)}}
>
  <div className="task-modal-item-content">
    <div className="title-container">
      <div className="task-modal-item-title">{item.name}</div>
      <CustomDropdownTaskCard
        task={item}
        handleDeletion={handleDelete}
        handleRecurringChange={handleRecurringChange}
        handleModalShow={handleEditModalShow}
      />
    </div>
    <div style={{ width: '60px', height: '60px', marginLeft: '10px' }}>
      <CircularProgressbar
        value={completionPercentage}
        text={`${Math.round(completionPercentage)}%`}
      />
    </div>
  </div>
</div>

    </>
  );
  return <>default view</>;
};
