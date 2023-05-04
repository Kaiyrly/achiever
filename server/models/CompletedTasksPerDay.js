const mongoose = require('mongoose');

const completedTasksPerDaySchema = new mongoose.Schema(
  {
    completedTasks: { type: Number, required: true, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: { type: Date, required: true, index: true, unique: false },
  },
  {
    timestamps: true,
  }
);


completedTasksPerDaySchema.index({ date: 1, userId: 1 }, { unique: true });



const CompletedTasksPerDay = mongoose.model('CompletedTasksPerDay', completedTasksPerDaySchema);

module.exports = CompletedTasksPerDay;
