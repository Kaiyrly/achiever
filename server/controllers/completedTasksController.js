const completedTasks = require("../models/CompletedTasksPerDay")




exports.updateDayStats = async (req, res) => {
  const userId = req.body.userId;
  const date = req.body.date;
  const taskComplete = req.body.taskComplete;
  console.log("completedTasks: ", userId, date)

  try {
    const dayStats = await completedTasks.findOneAndUpdate(
      { userId: userId, date: date },
      {
        $set: { userId: userId, date: date },
        $inc: { completedTasks: taskComplete ? 1 : -1 },
      },
      {
        new: true, 
        upsert: true, 
      }
    );

    console.log("Completed tasks: ", dayStats)

    res.status(200).json(dayStats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
  

exports.getAllStats = async(req, res) => {
    const userId = req.params.id;
    console.log(userId)
    try {
        const completedTasksPerDay = await completedTasks.find({ userId });
        console.log(completedTasksPerDay)
        res.send(completedTasksPerDay);
      } catch (err) {
        res.status(422).send(err.message);
      }
}