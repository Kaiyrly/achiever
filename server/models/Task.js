const mongoose = require("mongoose");

const baseOptions = {
  collection: "tasks",
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
};

const TaskSchema = new mongoose.Schema({
  name: String,
  taskId: {
    type: String,
    required: true,
    uniquq: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  goalId: String,
  taskComplete: Boolean,
  recurring: Boolean,
  taskType: String,
  value: mongoose.Schema.Types.Mixed,
  completionDate: {
    type: Date,
    default: null,
  },
}, baseOptions);

TaskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = { Task };
