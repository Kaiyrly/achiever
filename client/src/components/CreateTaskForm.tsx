import React, { useState } from 'react';
import { ITask, IToDoList, INumberType, IToDo, IBooleanType } from '../types';
import { breakdownRecurringTask } from '../services/gptApi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { randomIdGenerator } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';


export const CreateTaskForm: React.FC<{ createHandler?: (goal: ITask) => void, goalId: string  }> = ({ createHandler, goalId }) => {
  const [task, setTask] = useState<ITask>({
    name: '',
    taskId: uuidv4(),
    goalId: goalId, // need to change to the goal's id
    value: new IToDoList([]),
    taskComplete: false,
    taskType: "ToDoList"
  });

  const [taskType, setTaskType] = useState('ToDoList');

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createHandler?.(task);
  };

  const isFormValid = () => {
    if (isEmpty(task.name)) {
      return false;
    }
  
    if (taskType === 'NumberType') {
      const numberType = task.value as INumberType;
      return (
        numberType.initialValue !== undefined &&
        numberType.targetValue !== undefined
      );
    }
  
    if (taskType === 'ToDoList') {
      const toDoList = task.value as IToDoList;
      return toDoList.value.length > 0;
    }
  
    return true;
  };

  const taskTypeForm = () => {

    const handleBreakTasks = async () => {
      if (task.name) {
        const simplerTasks = await breakdownRecurringTask(task.name);
        const toDoList = simplerTasks.split(',').map((item: string) => ({ name: item.trim(), value: false } as IToDo));
        console.log(toDoList)
        setTask({ ...task, value: new IToDoList(toDoList) });
      }
    };
  

    if (taskType === 'NumberType') {
      return (
        <Form.Group controlId="numberTask">
          <Form.Label>Initial Value</Form.Label>
          <Form.Control
            type="number"
            onChange={(e) => {
              const initialValue = parseInt(e.target.value);
              setTask({
                ...task,
                value: new INumberType(task.name, false, initialValue, initialValue, initialValue),
                taskType: taskType
              });
            }}
          />
          <Form.Label>Target Value</Form.Label>
          <Form.Control
            type="number"
            onChange={(e) => {
              const targetValue = parseInt(e.target.value);
              const numberType = task.value as INumberType;
              setTask({
                ...task,
                value: new INumberType(task.name, false, numberType.initialValue, numberType.currentValue, targetValue),
                taskType: "NumberType"
              });
            }}
          />
        </Form.Group>
      );
    }

    if (taskType === 'ToDoList') {
      return (
        <Form.Group controlId="toDoListTask">
          <Form.Label>To-Do Items (comma-separated)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            onChange={(e) => {
              const toDoList = e.target.value.split(',').map((item) => ({ name: item.trim(), value: false } as IToDo));
              setTask({
                ...task,
                value: new IToDoList(toDoList),
                taskType: "ToDoList"
              });
            }}
          />
          {/* <Button variant="secondary" onClick={handleBreakTasks} className="mt-3">
            Break Tasks
          </Button> */}
        </Form.Group>
      );
    }

    if (taskType === 'BooleanType') {
      return (
        <Form.Group controlId="booleanTask">
          <Form.Label>Value</Form.Label>
          <Form.Check
            type="checkbox"
            onChange={(e) => {
              const value = e.target.checked;
              setTask({
                ...task,
                value: new IBooleanType(task.name, value),
                taskType: "BooleanType",
              });
            }}
          />
        </Form.Group>
      );
    }

    return null;
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name of the task</Form.Label>
        <Form.Control
          type="text"
          placeholder="Do 100 push ups"
          onChange={(e) => {
            setTask({ ...task, name: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group controlId="taskTypeSelect">
        <Form.Label>Task Type</Form.Label>
        <Form.Select
          aria-label="Task Type"
          onChange={(e) => {
            let value: IBooleanType | INumberType | IToDoList;
        
            switch (e.target.value) {
              case 'NumberType':
                value = new INumberType(task.name, false, 0, 0, 0);
                break;
              case 'ToDoList':
                value = new IToDoList([]);
                break;
              case 'BooleanType':
                value = new IBooleanType(task.name, false);
                break;
              default:
                return;
            }
        
            setTaskType(e.target.value);
            setTask({ ...task, taskType: e.target.value, value });
          }}
        >

          <option value="ToDoList">To-Do List</option>
          <option value="NumberType">Number Type</option>
          <option value="BooleanType">Boolean Type</option>
        </Form.Select>
      </Form.Group>
      {taskTypeForm()}
      <Button type="submit" disabled={!isFormValid()}>
        Create!
      </Button>
    </Form>
  );
};
