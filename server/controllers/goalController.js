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
  const goalAchieved = req.body.goalAchieved;

  try {
    // Check if the goal exists
    const goal = await Goal.findOne({ goalId: goalId });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if the goal is being marked complete or incomplete
    if (goal.goalAchieved !== req.body.goalAchieved) {
      goal.goalAchieved = req.body.goalAchieved;

      // Set the completion date if the goal is being marked complete
      if (goal.goalAchieved) {
        goal.completionDate = new Date();
      } else {
        goal.completionDate = null;
      }
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
