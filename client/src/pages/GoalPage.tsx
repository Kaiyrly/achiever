import React, { useEffect, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ITask, INumberType, IToDoList, IToDo } from '../types';
import { ModalComponent } from '../components/ModalComponent';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { DisplayTaskList } from '../components/DisplayTaskList';
import { updateTask, createTask, updateGoal } from '../services/api';
import { useLocation } from 'react-router-dom';
import '../styles/GoalPage.css';

interface IFetchedTask {
  completionDate: Date;
  createdAt: Date; 
  goalId: string; 
  id: string;
  name: string;
  taskComplete: boolean;
  taskId: string
  taskType: string
  updatedAt: Date
  value: any
}


export const GoalPage: React.FC = () => {
    const params = useParams();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const goalName = location.state?.goalName || '';
    const goalId = params.id ?? '';

    const [goalAchieved, setGoalAchieved] = useState(false);

    const formatTask = (task: IFetchedTask) => {
      const derivedTask: ITask = {
        name: task.name,
        taskId: task.taskId,
        goalId: task.goalId,
        value: task.value,
        taskComplete: task.taskComplete,
        taskType: task.taskType,
      };

      if (task.taskType === 'NumberType') {
        derivedTask.value = new INumberType(task.name, task.taskComplete, task.value.initialValue, task.value.currentValue, task.value.targetValue);
      }
      if (task.taskType === 'ToDoList') {
        const toDoList: IToDo[] = task.value;
        derivedTask.value = new IToDoList(toDoList);
      }

      return derivedTask
    }


    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/tasks?goalId=${params.id}`);
        if (!response.ok) {
          throw new Error('Error fetching tasks');
        }
        const fetchedTasks = await response.json();
        const derivedTasks: ITask[] = [];
    
        for (let i = 0; i < fetchedTasks.length; i++) {
          const task = fetchedTasks[i];
          derivedTasks.push(formatTask(task));
        }
    
        setTasks(derivedTasks);
      } catch (error) {
        console.error(`Error fetching tasks: ${error}`);
      }
    };
  useEffect(() => {
    fetchTasks();
  }, [params.id]);

  const newTask = (task: ITask) => {
    setTasks((oldTasks) => [...oldTasks, task]);
    setShowModal(false);
  };

  const handleCreation = async (taskData: any) => {
    try {
      const response = await createTask(taskData);
      const newTaskData = response.newTask;
      newTask(formatTask(newTaskData));
    } catch (error) {
      console.error(`Error creating task: ${error}`);
    }
  };


  const updateTaskInDatabase = async (updatedTask: ITask) => {
    updatedTask.goalId = params.id ?? '';
    try {
      await updateTask(updatedTask);
      setTasks((oldTasks) =>
        oldTasks.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task)),
      );
    } catch (error) {
      console.error(`Error updating task in database: ${error}`);
    }
  };

  const filterTasksByCompletionStatus = (tasks: ITask[], completed: boolean) => {
    return tasks.filter(task => task.taskComplete === completed);
  };
  
  const handleModalClose = () => {
    // This can be left empty or you can add any logic needed when the modal is closed.
  };

  const handleTaskDeletion = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);
      setTasks((oldTasks) => oldTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error(`Error deleting task: ${error}`);
    }
  };


  return (
    <>
      <div className="goal-page-container">
        {showModal && (
          <ModalComponent setShowModal={setShowModal} title="Create Task" onClose={handleModalClose}>
            <CreateTaskForm createHandler={handleCreation} goalId={params.id ?? ''} />
          </ModalComponent>
        )}
        <Button
          className="create-task-button"
          variant="primary"
          size="lg"
          onClick={() => setShowModal(true)}
        >
          Create new task
        </Button>{' '}
        <p className="goal-name">{goalName}</p>
        <Tabs defaultActiveKey="inProcess" id="task-tabs">
          <Tab eventKey="inProcess" title="In Process">
            <DisplayTaskList
              key={tasks.length}
              taskList={filterTasksByCompletionStatus(tasks, false)}
              onUpdateTask={updateTaskInDatabase}
              onDeleteTask={handleTaskDeletion}
            />
          </Tab>
          <Tab eventKey="completed" title="Completed">
            <DisplayTaskList
              key={tasks.length}
              taskList={filterTasksByCompletionStatus(tasks, true)}
              onUpdateTask={updateTaskInDatabase}
              onDeleteTask={handleTaskDeletion}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
  
};





