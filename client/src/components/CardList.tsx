import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from './GoalCard';
import { IGoal } from '../types';
import '../App.css';
import '../styles/CardList.css';


interface CardListProps {
  goals: IGoal[];
  onDeleteGoal: (goalId: string) => void;
  onUpdateGoal: (editiedGoal: IGoal) => void;
  onEditGoal: (goal: IGoal) => void; // Add this line
  searchQuery: string;
}

export const CardList: React.FC<CardListProps> = ({ goals, onDeleteGoal, onUpdateGoal, onEditGoal, searchQuery }) => {
  const navigate = useNavigate();



  const goToGoal = (goalId: String, goalName: String) => {
    navigate('/goals/' + goalId, { state: { goalName } });
  };


  const handleDeleteGoal = async (goalId: string) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this goal?");
    if (userConfirmed) {
      await onDeleteGoal(goalId);
    }
  };


  const handleGoalAchievedChange = async (goalId: string, goalAchieved: boolean) => {
    const goalToUpdate = goals.find((goal) => goal.goalId === goalId);
    if (goalToUpdate) {
      const updatedGoal = { ...goalToUpdate, goalAchieved };
      await onUpdateGoal(updatedGoal);
    }
  };


  const filteredGoals = goals.filter((goal) =>
    goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );



  return (
    <div className="card-container">
      {filteredGoals.map((goal) => (
        <GoalCard
          key={goal.goalId}
          goal={goal}
          handleDeleteGoal={handleDeleteGoal}
          handleGoalAchievedChange={handleGoalAchievedChange}
          onEditGoal={onEditGoal}
          goToGoal={goToGoal}
        />
      ))}
    </div>
  );
  
};
