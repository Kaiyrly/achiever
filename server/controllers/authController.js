// authController.js
const config = require("../config/authConfig");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
  
      await user.save();
  
      res.send({ message: "User was registered successfully!" });
    } catch (err) {
      res.status(500).send({ message: err });
      console.log(err)
    }
  };
  

  exports.signin = async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      }).exec();
  
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
  
      if (!passwordIsValid) {
        console.log("Invalid password")
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
  
      const token = jwt.sign({ userId: user._id, username: user.username }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
  
      console.log(user);
  
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
      console.log(err)
    }
  };
  
  
  exports.updatePassword = async (req, res) => {
    console.log(req.body)
    try {
      const userId = req.userId; // Assuming userId is set in the request by the middleware
      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;
  
      const user = await User.findOne(userId).exec();
  
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Current password is incorrect." });
      }
  
      const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedNewPassword;
      await user.save();
      res.status(200).send({ message: "Password updated successfully." });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  };
  
  
  