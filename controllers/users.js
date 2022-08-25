const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { listenerCount } = require("../model/Message");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { username: 1 });
  res.status(200).json(users);
};

const getCurrentUser = async (req, res) => {
  let cookie = req.headers.cookie;
  // if (!token || !token.startsWith("Bearer")) {
  //   throw new Error("Invalid authenctication");
  // }
  token = cookie.split("=")[1];
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    res.json(payload);
  } catch (error) {
    res.send("error");
  }
};

module.exports = { getAllUsers, getCurrentUser };
