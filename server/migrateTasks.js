require('dotenv').config();
const mongoose = require('mongoose');
const { Task } = require('./models/Task');

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateTasksWithUserId = async () => {
  try {
    const tasksWithoutUserId = await Task.find({ priority: { $exists: false } });

    for (const task of tasksWithoutUserId) {
        task.priority = false;
        await task.save();
        console.log(task)
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

updateTasksWithUserId();
