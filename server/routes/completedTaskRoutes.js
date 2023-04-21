const express = require('express');
const completedTasksController = require('../controllers/completedTasksController');

const router = express.Router();

router.put('/', completedTasksController.updateDayStats);
router.get('/:id', completedTasksController.getAllStats);

module.exports = router;