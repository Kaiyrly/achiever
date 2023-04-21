const mongoose = require('mongoose');

const completedTasksPerDaySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    completedTasks: { type: Number, required: true, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompletedTasksPerDay = mongoose.model('CompletedTasksPerDay', completedTasksPerDaySchema);

module.exports = CompletedTasksPerDay;
