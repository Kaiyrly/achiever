const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const goalRoutes = require('./routes/goalRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const authRoutes = require('./routes/authRoutes');
const completedTaskRoutes = require('./routes/completedTaskRoutes')
const gptRoutes = require('./routes/gptRoutes');


router.use('/api/goals', goalRoutes);
router.use('/api/tasks', taskRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/completedTasksPerDay', completedTaskRoutes);
router.use('/gpt3', gptRoutes);

module.exports = router;
