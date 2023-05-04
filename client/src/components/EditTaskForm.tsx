import React, { useState, useEffect } from 'react';
import { ITask, IToDoList, INumberType, IToDo, IBooleanType } from '../types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { isEmpty } from 'lodash';


interface EditTaskFormProps {
  initialTask: ITask;
  editHandler: (updatedTask: ITask) => void;
  onCancel: () => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  initialTask,
  editHandler,
  onCancel,
}) => {
  const [task, setTask] = useState<ITask>(initialTask);
  const [taskType, setTaskType] = useState(initialTask.taskType);


  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editHandler(task);
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
    if (isNumberType(task.value)) {
      return (
        <Form.Group controlId="numberTask">
          <Form.Label>Initial Value</Form.Label>
          <Form.Control
            type="number"
            value={task.value.initialValue}
            onChange={(e) => {
              const initialValue = parseInt(e.target.value) || 0;
              const numberType = task.value as INumberType;
              numberType.initialValue = initialValue
              setTask({
                ...task,
                value: numberType,
              });
            }}
          />
          <Form.Label>Target Value</Form.Label>
          <Form.Control
            type="number"
            value={task.value.targetValue}
            onChange={(e) => {
              const targetValue = parseInt(e.target.value) || 0;
              const numberType = task.value as INumberType;
              numberType.targetValue = targetValue
              setTask({
                ...task,
                value: numberType,
              });
            }}
          />
        </Form.Group>
      );
    }
    if (isToDoList(task.value)) {
        return (
          <Form.Group controlId="toDoListTask">
            <Form.Label>To-Do Items (comma-separated)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={task.value.value.map((item: IToDo) => item.name).join(', ')}
              onChange={(e) => {
                const toDoList = e.target.value
                  .split(',')
                  .map((item) => {
                    const trimmedItem = item.trim();
                    const existingItem = isToDoList(initialTask.value) && initialTask.value.value.find(
                      (existing: IToDo) => existing.name === trimmedItem
                    );

                    return existingItem
                      ? existingItem
                      : ({ name: trimmedItem, value: false } as IToDo);
                  });
                setTask({
                  ...task,
                  value: new IToDoList(toDoList),
                });
              }}
            />
          </Form.Group>
        );
      }      

      if (isBooleanType(task.value)) {
        return (
          <Form.Group controlId="booleanTask">
            <Form.Label>Value</Form.Label>
            <Form.Check
              type="checkbox"
              checked={task.value.value}
              onChange={(e) => {
                const value = e.target.checked;
                const booleanType = task.value as IBooleanType;
                booleanType.value = value
                setTask({
                  ...task,
                  value: booleanType,
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
          placeholder="Do 150 push ups"
          value={task.name} // Set the value to the task's name
          onChange={(e) => {
            setTask({ ...task, name: e.target.value });
          }}
        />
      </Form.Group>
      {/* <Form.Group controlId="taskTypeSelect"> */}
        {/* <Form.Label>Task Type</Form.Label> */}
        {/* <Form.Select
            aria-label="Task Type"
            value={taskType}
            onChange={(e) => {
                let value;

                switch (e.target.value) {
                    case 'NumberType':
                        if (initialTask.taskType === 'NumberType') {
                        value = initialTask.value;
                        } else {
                        value = new INumberType(task.name, false, 0, 0, 0);
                        }
                        break;
                    case 'ToDoList':
                        if (initialTask.taskType === 'ToDoList') {
                        value = initialTask.value;
                        } else {
                        value = new IToDoList([]);
                        }
                        break;
                    case 'BooleanType':
                        if (initialTask.taskType === 'BooleanType') {
                        value = initialTask.value;
                        } else {
                        value = new IBooleanType(task.name, false);
                        }
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
        </Form.Select> */}
      {/* </Form.Group> */}
      {taskTypeForm()}
      <Button type="submit" disabled={!isFormValid()}>Save changes</Button>
      <Button variant="secondary" className="ml-2" onClick={onCancel}>Cancel</Button>
    </Form>
 

  );
};
