import React, { useState, useCallback } from 'react';
import { ListGroup, ToggleButton } from 'react-bootstrap';
import { IToDo, ITask, IToDoList } from '../types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SingleToDo: React.FC<{ todoItem: IToDo; index: number; onTodoToggle: (index: number) => void }> = ({ todoItem, index, onTodoToggle }) => {
  const [todo, setTodo] = useState<IToDo>(todoItem);

  const handleClick = () => {
    setTodo({ ...todo, value: !todo.value });
    onTodoToggle(index);
  };

  return (
    <ListGroup.Item
      onClick={handleClick}
      key={index}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      {String(index + 1) + '. ' + todo.name}
      <ToggleButton
        variant={todo.value ? 'outline-success' : 'outline-primary'}
        value={1}
        size="sm"
        style={{ marginRight: 0 }}
      >
        {todo.value ? 'Done' : 'In process'}
      </ToggleButton>
    </ListGroup.Item>
  );
};

interface ToDoTypeViewProps {
  item: ITask;
  taskId: string;
  onClose: (todolist: IToDoList, todos: IToDo[]) => void;
}


const ToDoTypeView: React.FC<ToDoTypeViewProps> = ({ item, taskId, onClose }) => {
  const todoList = item.value as IToDoList;
  const [todos, setTodos] = useState<IToDo[]>(todoList.value);

  const handleTodoToggle = useCallback((index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].value = !updatedTodos[index].value;
    setTodos(updatedTodos);
  }, [todos]);

  const handleClose = async () => {
    onClose(todoList, todos);
  };

  return (
    <>
      <ListGroup defaultActiveKey="#link1">
        {todos.map((todoItem, index) => (
          <SingleToDo key={index} todoItem={todoItem} index={index} onTodoToggle={handleTodoToggle} />
        ))}
      </ListGroup>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ToDoTypeView;
