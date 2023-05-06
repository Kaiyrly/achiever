import axios from 'axios';
import { IGoal, ITask, IFetchedTask } from '../types';



// const API_URL = process.env.API_URL || 'http://localhost:5001'
const API_URL = 'https://milemarker.herokuapp.com';
const API = axios.create({
  baseURL: API_URL,
});

export const signIn = async (email: String, password: String) => {
  console.log(API_URL)
  console.log(process.env.API_URL)
  try {
    const { data } = await API.post(`${API_URL}/api/auth/signin`, { email, password });
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async(email: String, username: String, password: String) => {
  try {
    const { data } = await API.post(`${API_URL}/api/auth/signup`, { email, password, username });
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export const getGoals = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/goals?userId=${userId}`);
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
  const response = await API.post(`${API_URL}/api/goals`, { ...goal, userId });
  return response.data;
};

export const updateGoal = async (editedGoal: IGoal) => {
  const { goalId } = editedGoal;
  const response = await API.put(`${API_URL}/api/goals/${goalId}`, editedGoal);
  console.log(response);
  return response.data;
};

export const deleteGoal = async (goalId: string) => {
  const response = await API.delete(`${API_URL}/api/goals/${goalId}`);
  return response.data;
};

export const deleteTasksByGoalId = async (goalId: string) => {
  const response = await API.delete(`${API_URL}/api/tasks/goal/${goalId}`);
  return response.data;
};

export const createTask = async (task: ITask) => {
  const response = await API.post(`${API_URL}/api/tasks`, task);
  return response.data;
};

export const updateTask = async (task: ITask) => {
  const response = await API.put(`${API_URL}/api/tasks/${task.taskId}`, task);
  return response.data;
};

export const fetchTasksByGoalId = async (goalId: string): Promise<IFetchedTask[]> => {
  try {
    const response = await API.get(`${API_URL}/api/tasks?goalId=${goalId}`);
    const fetchedTasks = response.data;
    return fetchedTasks;
  } catch (error) {
    console.error(`Error fetching tasks: ${error}`);
    throw error;
  }
};

export const deleteTaskById = async (taskId: string) => {
  try {
    await API.delete(`/api/tasks/${taskId}`);
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    throw error;
  }
};


export const fetchCompletedTasks = async (userId: string) => {
  try {
    console.log(API)
    const response = await API.get(`${API_URL}/api/completedTasksPerDay/${userId}`)
    console.log(response)
    const completedTasks = response.data;
    return completedTasks;
  } catch (error) {
    console.log("Error fetching completed tasks: ", error);
  }
}

export const fetchRecurringTasks = async (userId: string) => {
  try {
    console.log(API_URL)
    const response = await API.get(`${API_URL}/api/tasks/recurring/${userId}`)
    console.log(response)
    const completedTasks = response.data;
    return completedTasks;
  } catch (error) {
    console.log("Error fetching recurring tasks: ", error);
  }
}

export const updateCompletedTasks = async (userId: string, date: Date, taskComplete: boolean) => {
  date.setHours(0, 0, 0, 0);
  try {
    const response = await API.put(`${API_URL}/api/completedTasksPerDay`, {
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
    const response = await API.post(`${API_URL}/api/login`, {
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


export const changePassword = async (userId: string, currentPassword: string, newPassword: string, token: string) => {
  try {
    const response = await API.put(`${API_URL}/api/auth/changePassword`, {
      currentPassword,
      newPassword,
      userId,
    }, {
      headers: {
        'x-access-token': token,
      },
    });

    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to update password.');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await API.post(`${API_URL}/api/auth/resetPassword`, { email });
    return response.data;
  } catch (error) {
    console.log("Error resetting password: ", error);
    throw error;
  }
}

export const fetchGPTAnswer = async (prompt: string) => {
  try {
    const response = await API.post(`${API_URL}/gpt3`, {
      prompt,
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return 'An error occurred while processing your request.';
  }
}