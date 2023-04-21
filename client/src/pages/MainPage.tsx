import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { CardList } from '../components/CardList';
import '../App.css'
import axios from 'axios';
import { ModalComponent } from '../components/ModalComponent';
import { CreateGoalForm } from '../components/CreateGoalForm';
import { IGoal } from '../types';
import { randomIdGenerator } from '../utils';
import { getGoals, createGoal, updateGoal } from '../services/api'
import { getUserIdFromToken } from '../helpers/index'
import useToken from '../hooks/useToken';
import '../styles/MainPage.css';


export const MainPage: React.FC = () => {
    const [goals, setGoals] = useState<IGoal[]>([]);
    const [showModal, setShowModal] = useState(false)
    const { token } = useToken();
    const userId = getUserIdFromToken(token ?? '') ?? '';
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const createNewGoal = (goal: IGoal) => {
        setGoals([...goals, goal])
        handleCreation(goal)
        setShowModal(false)
    }

    const handleCreation = async (newGoal: IGoal) => {
        try {
            const createdGoal = await createGoal(newGoal, userId);
          } catch (error) {
            console.error('Error creating goal:', error);
        }
    }



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
          await axios.delete(`http://localhost:5001/api/goals/${goalId}`);
          setGoals((oldGoals) => oldGoals.filter((goal) => goal.goalId !== goalId));
      
          // Delete all tasks related to the goal
          await axios.delete(`http://localhost:5001/api/tasks/goal/${goalId}`);
        } catch (error) {
          console.error(`Error deleting goal: ${error}`);
        }
      };

      const handleGoalUpdate = async (goalId: string, goalAchieved: boolean) => {
        try {
          await axios.put(`http://localhost:5001/api/goals/${goalId}`, { goalAchieved });
          setGoals((oldGoals) =>
            oldGoals.map((goal) => (goal.goalId === goalId ? { ...goal, goalAchieved } : goal))
          );
        } catch (error) {
          console.error(`Error updating goal: ${error}`);
        }
      };
    
      

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
              <ModalComponent setShowModal={setShowModal} title="Create Goal" onClose={handleModalClose}>
                <CreateGoalForm createHandler={createNewGoal} />
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
                  searchQuery={searchQuery}
                />
              </Tab>
              <Tab eventKey="achieved" title="Achieved">
                <CardList
                  goals={filterGoalsByAchievementStatus(goals, true)}
                  onDeleteGoal={handleGoalDeletion}
                  onUpdateGoal={handleGoalUpdate}
                  searchQuery={searchQuery}
                />
              </Tab>
            </Tabs>
          </div>
        </>
      );
      
}
