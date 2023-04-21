import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { IGoal } from '../types';
import '../App.css';
import '../styles/CardList.css';


interface CardListProps {
  goals: IGoal[];
  onDeleteGoal: (goalId: string) => Promise<void>;
  onUpdateGoal: (goalId: string, goalAchieved: boolean) => Promise<void>;
  searchQuery: string;
}

export const CardList: React.FC<CardListProps> = ({ goals, onDeleteGoal, onUpdateGoal, searchQuery }) => {
  const navigate = useNavigate();

  const goToGoal = (goalId: String, goalName: String) => {
    navigate('/goals/' + goalId, { state: { goalName } });
  };

  const handleDeleteGoal = async (goalId: string) => {
    await onDeleteGoal(goalId);
  };


  const handleGoalAchievedChange = async (goalId: string, goalAchieved: boolean) => {
    await onUpdateGoal(goalId, goalAchieved);
  };

  const filteredGoals = goals.filter((goal) =>
    goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayCards = filteredGoals.map((goal) => {
    return (
      <Card key={goal.goalId} className="goal-card">
        <Card.Body>
          <div className="clickable-title" onClick={() => goToGoal(goal.goalId, goal.name)}>
            <Card.Title>{goal.name}</Card.Title>
          </div>
          <div>
            {goal.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="goal-achieved">
            <input
              type="checkbox"
              id={`goalAchievedCheckbox-${goal.goalId}`}
              checked={goal.goalAchieved}
              onChange={(e) => handleGoalAchievedChange(goal.goalId, e.target.checked)}
            />
            <label htmlFor={`goalAchievedCheckbox-${goal.goalId}`}>Goal Achieved</label>
          </div>
          <Button variant="secondary" className="delete-goal-btn" onClick={() => handleDeleteGoal(goal.goalId)}>
            <FaTrash />
          </Button>
        </Card.Footer>
      </Card>
    );
  });

  return <div className="card-container">{displayCards}</div>;
};
