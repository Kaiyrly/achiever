import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ITask, INumberType, IToDoList, IToDo, IFetchedTask, IBooleanType } from '../types';
import { DisplayTaskList } from '../components/DisplayTaskList';
import { updateTask, fetchRecurringTasks, deleteTaskById  } from '../services/api';
import { useLocation } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { getUserIdFromToken } from '../helpers';

import '../styles/GoalPage.css';


export const RecurringTasks: React.FC = () => {
    const params = useParams();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const location = useLocation();

    const { token } = useToken();
    const userId = getUserIdFromToken(token ?? '') ?? '';


    const formatTask = (task: IFetchedTask) => {
      const derivedTask: ITask = {
        name: task.name,
        taskId: task.taskId,
        goalId: task.goalId,
        userId: task.userId,
        recurring: task.recurring,
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
      if (task.taskType === 'BooleanType') {
        // const toDoList: IBooleanType = task.value;
        derivedTask.value = new IBooleanType(task.value.name, task.value.value);
      }

      return derivedTask
    }


    const fetchTasks = async () => {
      try {
        const fetchedTasks = await fetchRecurringTasks(userId); // Use the fetchTasksByGoalId function
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



  const updateTaskInDatabase = async (updatedTask: ITask) => {
    updatedTask.goalId = params.id ?? '';
    // const a: {b: any, c: any} = {b: 0, c: 0};
    // console.log(a.b.c.d)
    try {
      await updateTask(updatedTask);
      setTasks((oldTasks) =>
        oldTasks.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task)),
      );
    } catch (error) {
      console.error(`Error updating task in database: ${error}`);
    }
  };


  
  const handleModalClose = () => {
    // This can be left empty or you can add any logic needed when the modal is closed.
  };

  const handleTaskDeletion = async (taskId: string) => {
    try {
      await deleteTaskById(taskId); // Use the deleteTaskById function
      setTasks((oldTasks) => oldTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error(`Error deleting task: ${error}`);
    }
  };

  return (
    <>
      <div className="goal-page-container">
        <DisplayTaskList
            key={tasks.length}
            taskList={tasks}
            onUpdateTask={updateTaskInDatabase}
            onDeleteTask={handleTaskDeletion}
        />
      </div>
    </>
  );
  
};





