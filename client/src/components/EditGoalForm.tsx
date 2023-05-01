import React, { useState, useEffect } from 'react'
import { IGoal } from '../types'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface EditGoalFormProps {
    goal: IGoal;
    editHandler: (goal: IGoal) => void;
    closeModal: () => void;
  }

export const EditGoalForm: React.FC<EditGoalFormProps> = ({ goal, editHandler, closeModal }) => {
  const [formGoal, setFormGoal] = useState<IGoal>({ ...goal });

  useEffect(() => {
    setFormGoal({ ...goal });
  }, [goal]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formGoal)
    editHandler(formGoal);
    closeModal();
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name of the goal</Form.Label>
        <Form.Control
          type="text"
          placeholder="Apply to OnSquare"
          value={formGoal.name}
          onChange={(e) => { setFormGoal({ ...formGoal, name: e.target.value }) }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
        <Form.Label>Tags</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter comma-separated tags"
          value={formGoal.tags.join(',')}
          onChange={(e) => {
            setFormGoal({ ...formGoal, tags: e.target.value.split(',') });
          }}
        />
        <Form.Text className="text-muted">
          Separate tags with commas, e.g., "fitness, health, gym"
        </Form.Text>
      </Form.Group>
      <Button type='submit'>Save Changes</Button>
      <Button variant="secondary" className="ml-2" onClick={closeModal}>Cancel</Button>
    </Form>
  )
}
