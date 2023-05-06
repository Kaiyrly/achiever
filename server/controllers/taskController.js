const { Task, NumberTypeTask, ToDoListTask, BooleanTypeTask } = require("../models/Task");


exports.createTask = async (req, res) => {
  try {
    let taskData = {
      name: req.body.name,
      taskId: req.body.taskId,
      goalId: req.body.goalId,
      userId: req.body.userId,
      taskComplete: req.body.taskComplete,
      taskType: req.body.taskType,
    };

    switch (req.body.taskType) {
      case "NumberType":
        taskData.value = req.body.value;
        break;
      case "ToDoList":
        taskData.value = req.body.value.value;
        break;
      case "BooleanType":
        taskData.value = req.body.value;
        break;
      default:
        res.status(400).json({ message: "Invalid task type" });
        return;
    }


    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json({ newTask, taskId: newTask.taskId });
  } catch (error) {
    console.log(error);
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

exports.getRecurringTasks = async(req, res) => {
  const userId = req.params.id;
  try {
    const tasks = await Task.find({ recurring: true, taskComplete: false, userId: userId });
    console.log(userId, tasks);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
  console.log(req.body.taskType);
  try {
    const updateData = {
      name: req.body.name,
      taskType: req.body.taskType,
      taskComplete: req.body.taskComplete,
      value: req.body.taskType === "ToDoList" ? req.body.value.value : req.body.value,
      recurring: req.body.recurring
    };
    console.log("update task")
    console.log(updateData);

    if (req.body.taskComplete) {
      updateData.completionDate = new Date();
    } else {
      updateData.completionDate = null;
    }

    const task = await Task.findOneAndUpdate({ taskId: taskId }, updateData, { new: true });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    console.log(task.taskType);

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
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