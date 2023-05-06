import axios from 'axios';
import { fetchGPTAnswer } from './api';

const API_KEY = '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';


export const breakdownRecurringTask = async(taskDescription: string) => {
  // const prompt = `Please break down the following recurring task into simpler tasks: "${taskDescription}". Output the simpler tasks separated by commas.`;
  const prompt = `Return the answer as strings separated by comma. Please break down the following recurring task into simpler tasks: "${taskDescription}". Respond just with strings separated with commas start the output with 'tasks: ' and finish the output with 'end of tasks.' Return less than 200 characters`
  try {
    const simplerTasks = await fetchGPTAnswer(prompt);
    return extractTasks(simplerTasks.text);
  } catch(error) {
    throw error;
  }
}

const extractTasks = (response: string) => {
  const tasksStart = "tasks: ";
  const tasksEnd = "end of tasks.";

  const startIndex = response.indexOf(tasksStart) + tasksStart.length;
  const endIndex = response.indexOf(tasksEnd);

  const tasksString = response.slice(startIndex, endIndex);
  // const tasksArray = tasksString.split(', ');

  return tasksString;
}