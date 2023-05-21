const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, deleteTaskByGoalId, getCompletedTasks, getPriorityTasks } = require('../controllers/taskController');

router.get('/', getTasks);
router.get("/completed", getCompletedTasks);
router.get("/priority/:id", getPriorityTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.delete('/goal/:id', deleteTaskByGoalId);


module.exports = router;
