const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "taskType",
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
    required: true
  },
  goalId: String,
  taskComplete: Boolean,
  taskType: String,
  value: mongoose.Schema.Types.Mixed,
  completionDate: {
    type: Date,
    default: null,
  }
}, baseOptions);

TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const NumberTypeSchema = new mongoose.Schema({
  value: {
    name: String,
    value: Boolean,
    initialValue: Number,
    currentValue: Number,
    targetValue: Number,
  }
});

const ToDoListSchema = new mongoose.Schema({
  value: [
    {
      name: String,
      value: Boolean,
      _id: String,
    },
  ],
}, baseOptions);


const Task = mongoose.model("Task", TaskSchema);
const NumberTypeTask = Task.discriminator("NumberType", NumberTypeSchema);
const ToDoListTask = Task.discriminator("ToDoList", ToDoListSchema);
module.exports = { Task, NumberTypeTask, ToDoListTask };
