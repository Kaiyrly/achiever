import React, { useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CustomDropdown } from './CustomDropdown';
import { IGoal } from '../types';

import '../styles/CardList.css';
import '../styles/GoalCard.css';

interface GoalCardProps {
  goal: IGoal;
  handleDeleteGoal: (goalId: string) => void;
  handleGoalAchievedChange: (goalId: string, goalAchieved: boolean) => void;
  onEditGoal: (goal: IGoal) => void;
  goToGoal: (goalId: string, goalName: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, handleDeleteGoal, handleGoalAchievedChange, onEditGoal, goToGoal }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    return (
      <Card key={goal.goalId} className="goal-card">
          <Card.Body>
            <Card.Title>{goal.name}</Card.Title>
            <div>
              {goal.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </Card.Body>
          <Card.Footer className="goal-card-footer">
            <Button
              variant="outline-success"
              onClick={(e) => {
                // e.stopPropagation();
                goToGoal(goal.goalId, goal.name);
              }}
            >
              Show Tasks
            </Button>
            <div className="ml-auto">
              <CustomDropdown
                  goal={goal}
                  handleDeleteGoal={handleDeleteGoal}
                  onEditGoal={onEditGoal}
                  handleGoalAchievedChange={handleGoalAchievedChange}
              />
            </div>
          </Card.Footer>
      </Card>
    );
};

export default GoalCard;
