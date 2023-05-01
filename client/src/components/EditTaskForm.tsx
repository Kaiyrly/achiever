import React, { useState } from 'react';
import { ITask, IToDoList, INumberType, IToDo } from '../types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { randomIdGenerator } from '../utils';
import { v4 as uuidv4 } from 'uuid';

interface EditTaskFormProps {
    initialTask: ITask;
    editHandler: (updatedTask: ITask) => void;
    onCancel: () => void;
}
  
export const EditTaskForm: React.FC<EditTaskFormProps> = ({
    initialTask,
    editHandler,
    onCancel
    }) => {
    const [task, setTask] = useState<ITask>(initialTask);

  const [taskType, setTaskType] = useState(initialTask.taskType);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editHandler(task);
  };

  const isNumberType = (value: IToDoList | INumberType): value is INumberType => {
    return (value as INumberType).initialValue !== undefined;
  };
  
  const taskTypeForm = () => {
    if (taskType === 'NumberType') {
      return (
        <Form.Group controlId="numberTask">
          <Form.Label>Initial Value</Form.Label>
          <Form.Control
            type="number"
            value={task.value && isNumberType(task.value) ? task.value.initialValue : ''}
            onChange={(e) => {
              const initialValue = parseInt(e.target.value);
              const numberType = task.value as INumberType;
              setTask({
                ...task,
                value: new INumberType(task.name, false, initialValue, initialValue, numberType.targetValue),
                taskType: taskType
              });
            }}
          />
          <Form.Label>Target Value</Form.Label>
          <Form.Control
            type="number"
            value={task.value && isNumberType(task.value) ? task.value.targetValue : ''}
            onChange={(e) => {
              const targetValue = parseInt(e.target.value);
              const numberType = task.value as INumberType;
              setTask({
                ...task,
                value: new INumberType(task.name, false, numberType.initialValue, numberType.currentValue, targetValue),
                taskType: taskType
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
            value={task.value && !isNumberType(task.value) ? task.value.value.map((item: IToDo) => item.name).join(', ') : ''}
            onChange={(e) => {
              const toDoList = e.target.value.split(',').map((item) => ({ name: item.trim(), value: false } as IToDo));
              setTask({
                ...task,
                value: new IToDoList(toDoList),
                taskType: taskType
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
        <Form.Label>Name of the goal</Form.Label>
        <Form.Control
          type="text"
          placeholder="Apply to OnSquare"
          value={task.name} // Set the value to the task's name
          onChange={(e) => {
            setTask({ ...task, name: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group controlId="taskTypeSelect">
        <Form.Label>Task Type</Form.Label>
        <Form.Select
          aria-label="Task Type"
          value={taskType} // Set the value to the task's type
          onChange={(e) => {
            setTaskType(e.target.value);
          }}
        >
          <option value="ToDoList">To-Do List</option>
          <option value="NumberType">Number Type</option>
        </Form.Select>
      </Form.Group>
      {taskTypeForm()}
      <Button type="submit">Save changes</Button>
      <Button variant="secondary" className="ml-2" onClick={onCancel}>Cancel</Button>
    </Form>
  );
};
