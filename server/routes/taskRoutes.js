const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, deleteTaskByGoalId, getCompletedTasks } = require('../controllers/taskController');

router.get('/', getTasks);
router.get("/completed", getCompletedTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.delete('/goal/:id', deleteTaskByGoalId);


module.exports = router;
