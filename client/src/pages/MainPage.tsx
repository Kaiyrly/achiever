import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { CardList } from '../components/CardList';
import '../App.css'
import { ModalComponent } from '../components/ModalComponent';
import { CreateGoalForm } from '../components/CreateGoalForm';
import { EditGoalForm } from '../components/EditGoalForm';
import { PriorityTasks } from '../components/PriorityTasks';
import { IGoal } from '../types';
import { getUserIdFromToken } from '../helpers/index'
import useToken from '../hooks/useToken';
import '../styles/MainPage.css';
import {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
  deleteTasksByGoalId
} from '../services/api';

export const MainPage: React.FC = () => {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [showModal, setShowModal] = useState(false)
  const { token } = useToken();
  const userId = getUserIdFromToken(token ?? '') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<IGoal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const createNewGoal = async (goal: IGoal) => {
    try {
      const createdGoal = await createGoal(goal, userId);
      setGoals([...goals, createdGoal]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const fetchedGoals = await getGoals(userId);
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleModalClose = () => {
    // This can be left empty or you can add any logic needed when the modal is closed.
  };

  const filterGoalsByAchievementStatus = (goals: IGoal[], achieved: boolean) => {
    return goals.filter(goal => goal.goalAchieved === achieved);
  };

  const handleGoalDeletion = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals((oldGoals) => oldGoals.filter((goal) => goal.goalId !== goalId));
  
      await deleteTasksByGoalId(goalId);
    } catch (error) {
      console.error(`Error deleting goal: ${error}`);
    }
  };

  const handleGoalUpdate = async (editedGoal: IGoal) => {
    try {
      await updateGoal(editedGoal);
      setGoals((oldGoals) =>
        oldGoals.map((goal) => (goal.goalId === editedGoal.goalId ? editedGoal : goal))
      );
    } catch (error) {
      console.error(`Error updating goal: ${error}`);
    }
  };


  const handleGoalEdit = (goal: IGoal) => {
    setSelectedGoal(goal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGoal(null);
  }


  return (
    <>
      <div className="main-page-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or tag"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />

        {showModal && (
              <ModalComponent setShowModal={setShowModal} title={selectedGoal ? 'Edit Goal' : 'Create Goal'} onClose={handleModalClose}>
                {selectedGoal ? (
                  <EditGoalForm goal={selectedGoal} editHandler={handleGoalUpdate} closeModal={closeModal} />
                ) : (
                  <CreateGoalForm createHandler={createNewGoal} />
                )}
              </ModalComponent>
            )}
            <Button
              className="create-goal-button"
              variant="primary"
              size="lg"
              onClick={() => setShowModal(true)}
            >
              Create new goal
            </Button>
            {' '}
            <Tabs defaultActiveKey="inProcess" id="goal-tabs">
              <Tab eventKey="inProcess" title="In Process">
                <CardList
                  goals={filterGoalsByAchievementStatus(goals, false)}
                  onDeleteGoal={handleGoalDeletion}
                  onUpdateGoal={handleGoalUpdate}
                  onEditGoal={handleGoalEdit}
                  searchQuery={searchQuery}
                />
              </Tab>
              <Tab eventKey="achieved" title="Achieved">
                <CardList
                  goals={filterGoalsByAchievementStatus(goals, true)}
                  onDeleteGoal={handleGoalDeletion}
                  onUpdateGoal={handleGoalUpdate}
                  onEditGoal={handleGoalEdit}
                  searchQuery={searchQuery}
                />
              </Tab>
              <Tab eventKey="priorityTasks" title="Priority Tasks">
                  <PriorityTasks />
              </Tab>
            </Tabs>
      </div>
    </>     
);
};