const { Task, NumberTypeTask, ToDoListTask } = require("../models/Task");


exports.createTask = async (req, res) => {
  try {
    let newTask;
    switch (req.body.taskType) {
      case "NumberType":
        newTask = new NumberTypeTask(req.body);
        break;
      case "ToDoList":
        newTask = new ToDoListTask({name: req.body.name, taskId: req.body.taskId, goalId: req.body.goalId, value: req.body.value.value, taskComplete: req.body.taskComplete});
        break;
      default:
        res.status(400).json({ message: "Invalid task type" });
        return;
    }

    await newTask.save();
    res.status(201).json({newTask, taskId: newTask.taskId});
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const goalId = req.query.goalId;
  try {
    const tasks = await Task.find({ goalId: goalId});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompletedTasks = async (req, res) => {
  try {

    const completedTasks = await Task.find({
      taskComplete: true
    });

    res.json(completedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    let task;
    switch (req.body.taskType) {
      case "NumberType":
        task = await Task.findOneAndUpdate({ taskId: taskId }, {value: req.body.value}, { new: true }); 
        break;
      case "ToDoList":
        task = await Task.findOneAndUpdate({taskId: taskId}, { value: req.body.value.value}, {new: true});
        break;
      default:
        res.status(400).json({ message: "Invalid task type" });
        return;
    }

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if the task is being marked complete or incomplete
    if (task.taskComplete !== req.body.taskComplete) {
      task.taskComplete = req.body.taskComplete;

      // Set the completion date if the task is being marked complete
      if (task.taskComplete) {
        task.completionDate = new Date();
      } else {
        task.completionDate = null;
      }
    }


    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error)
  }
};



exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({taskId: req.params.id});
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTaskByGoalId = async(req, res) => {
  try {
    const task = await Task.findOneAndDelete({goalId: req.params.id});
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};