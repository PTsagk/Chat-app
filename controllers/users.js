const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { username: 1 });
  res.status(200).json(users);
};

const getCurrentUser = async (req, res) => {
  if (req.user != "error") {
    const currentUser = req.user.username;
    res.send(currentUser);
  } else {
    res.send("error");
  }
};

module.exports = { getAllUsers, getCurrentUser };
