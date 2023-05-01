const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  const userId = req.query.userId;
  try {
    const goals = await Goal.find({ userId: userId }).populate('tasks');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGoal = async (req, res) => {
  // const { name, imgUrl } = req.body;
  try {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  const goalId = req.params.id;
  const editedGoal = req.body;
  try {
    // Check if the goal exists
    const goal = await Goal.findOne({ goalId: goalId });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update goal fields with the editedGoal values
    goal.name = editedGoal.name;
    goal.description = editedGoal.description;
    goal.tags = editedGoal.tags;
    goal.goalAchieved = editedGoal.goalAchieved;
    goal.startDate = editedGoal.startDate;
    goal.endDate = editedGoal.endDate;

    // Set the completion date if the goal is being marked complete
    if (goal.goalAchieved) {
      goal.completionDate = new Date();
    } else {
      goal.completionDate = null;
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({goalId: req.params.id});
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
