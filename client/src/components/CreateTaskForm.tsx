import React, { useState } from 'react';
import { ITask, IToDoList, INumberType, IToDo, IBooleanType } from '../types';
import { breakdownPriorityTask } from '../services/gptApi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { randomIdGenerator } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import useToken from '../hooks/useToken';
import { getUserIdFromToken } from '../helpers';

export const CreateTaskForm: React.FC<{ createHandler?: (goal: ITask) => void, goalId: string  }> = ({ createHandler, goalId }) => {
  const { token } = useToken();
  const userId = getUserIdFromToken(token ?? '') ?? '';

  const [task, setTask] = useState<ITask>({
    name: '',
    taskId: uuidv4(),
    goalId: goalId, // need to change to the goal's id
    userId: userId,
    value: new IToDoList([]),
    taskComplete: false,
    priority: false,
    taskType: "ToDoList"
  });

  const [taskType, setTaskType] = useState('ToDoList');
  const [toDoTextArea, setToDoTextArea] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskType === 'ToDoList') {
      const toDoList = toDoTextArea.split(',').map((item) => ({ name: item.trim(), value: false } as IToDo));
      const updatedTask = {
        ...task,
        value: new IToDoList(toDoList),
      };
      createHandler?.(updatedTask);
    } else {
      if (isNumberType(task.value)) {
        if (isNaN(task.value.initialValue)) {
          task.value.initialValue = 0;
        }
        if (isNaN(task.value.targetValue)) {
          task.value.targetValue = 0;
        }
      }
      createHandler?.(task);
    }
  };

  const isNumberType = (value: IToDoList | INumberType | IBooleanType): value is INumberType => {
    return (value as INumberType).initialValue !== undefined;
  };

  const isToDoList = (value: IToDoList | INumberType | IBooleanType): value is IToDoList => {
    return Array.isArray((value as IToDoList).value);
  };

  const isBooleanType = (value: IToDoList | INumberType | IBooleanType): value is IBooleanType => {
    return (value as IBooleanType).name !== undefined && typeof (value as IBooleanType).value === 'boolean';
  };

  const handleBreakTasks = async () => {
    if (description) {
      setIsLoading(true);
      try {
        const simplerTasks = await breakdownPriorityTask(description);
        setToDoTextArea(simplerTasks);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      } finally {
        handleCloseModal();
      }
    }
  };

  const taskTypeForm = () => {
    

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
            value={toDoTextArea}
            onChange={(e) => setToDoTextArea(e.target.value)}
            onBlur={(e) => {
              const toDoList = e.target.value.split(',').map((item) => ({ name: item.trim(), value: false } as IToDo));
              setTask({
                ...task,
                value: new IToDoList(toDoList),
                taskType: "ToDoList"
              });
            }}
          />
          <Button variant="secondary" onClick={handleShowModal} className="mt-3">
            Use AI
          </Button>
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
    <>
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
            {/* <option value="BooleanType">Boolean Type</option> */}
          </Form.Select>
        </Form.Group>
        {taskTypeForm()}
        <Button type="submit">
          Create!
        </Button>
      </Form>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Describe Your Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="taskDescription">
            <Form.Label>Please provide a brief description of your task (not more than 100 characters):</Form.Label>
            <Form.Control
              type="text"
              maxLength={100}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBreakTasks} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Break Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};