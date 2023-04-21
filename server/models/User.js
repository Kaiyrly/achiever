const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  // Add relationships with Task and Goal models
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
