import axios from 'axios';
import { IGoal, ITask } from '../types';
import { cp } from 'fs';


const API_URL = 'http://localhost:5001/api';

const API = axios.create({
  baseURL: API_URL,
});

export const signIn = async (email: String, password: String) => {
  try {
    const { data } = await API.post('/auth/signin', { email, password });
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async(email: String, username: String, password: String) => {
  try {
    const { data } = await API.post('/auth/signup', { email, password, username });
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export const getGoals = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:5001/api/goals?userId=${userId}`);
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error('Error fetching goals');
    }
    const fetchedGoals = JSON.parse(responseText);
    return fetchedGoals
  } catch (error) {
    throw new Error('Error fetching goals');
  }
};

export const createGoal = async (goal: IGoal, userId: string) => {
  const response = await API.post(`${API_URL}/goals`, { ...goal, userId });
  return response.data;
};

export const updateGoal = async (goalId: string, goalAchieved: boolean) => {
  const response = await API.put(`${API_URL}/goals/${goalId}`, { goalAchieved });
  console.log(response);
  return response.data;
};

export const createTask = async (task: ITask) => {
  const response = await API.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (task: ITask) => {
  const response = await API.put(`${API_URL}/tasks/${task.taskId}`, task);
  return response.data;
};


export const fetchCompletedTasks = async (userId: string) => {
  try {
    const response = await API.get(`/completedTasksPerDay/${userId}`)
    const completedTasks = response.data;
    return completedTasks;
  } catch (error) {
    console.log("Error fetching completed tasks: ", error);
  }
}

export const updateCompletedTasks = async (userId: string, date: Date, taskComplete: boolean) => {
  console.log(userId, date, taskComplete)
  date.setHours(0, 0, 0, 0);
  try {
    const response = await API.put('/completedTasksPerDay', {
      userId,
      date,
      taskComplete,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to update completed tasks');
    }
  } catch (error) {
    console.error('Error updating completed tasks:', error);
  }
};

// export const updatePassword = async (userId, newPassowrd) => {
//   try {
//     const response = await API.put("/api/auth")
//   }
// }

export const fakeAuth = async (email: String, password: String) => {
  try {
    const response = await API.post('/api/login', {
      email,
      password,
    });

    if (response.status === 200) {
      return response.data.token;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
};

// Add more functions for different API calls
