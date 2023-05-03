import axios from 'axios';
import { fetchGPTAnswer } from './api';

const API_KEY = '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';


export const breakdownRecurringTask = async(taskDescription: string) => {
  const prompt = `Please break down the following recurring task into simpler tasks: "${taskDescription}". Output the simpler tasks separated by commas.`;
  const simplerTasks = await fetchGPTAnswer(prompt);
  console.log(simplerTasks)
  return simplerTasks;
}
