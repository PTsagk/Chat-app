const User = require("../model/User");
const Friends = require("../model/Friends");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { username: 1 });
  res.status(200).json(users);
};

const getFriends = async (req, res) => {
  try {
    const currentUser = req.user.username;
    const friends = await Friends.findOne({ username: currentUser });
    res.status(200).json(friends);
  } catch (error) {
    res.send(error);
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const friend = await Friends.updateOne(
      { username: req.body.friendToRequest },
      {
        $push: {
          friends: { username: req.user.username, isFriend: false },
        },
      }
    );
  } catch (error) {
    res.send(error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (req.user != "error") {
      const currentUser = req.user.username;
      res.send(currentUser);
    } else {
      res.send("error");
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = { getAllUsers, getFriends, sendFriendRequest, getCurrentUser };
