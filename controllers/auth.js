const User = require("../model/User");
const Friends = require("../model/Friends");
const { StatusCodes } = require("http-status-codes");

//Register user
const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    await Friends.create({ username: req.body.username });
    const token = user.createJWT();
    res.cookie("token", `Bearer ${token}`, {
      secure: false,
      httpOnly: true,
    });
    res.send("success");
  } catch (error) {
    res.send(error);
  }
};

//Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("there is an error");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (isPasswordCorrect) {
      const token = user.createJWT();
      res.cookie("token", `Bearer ${token}`, {
        secure: false,
        httpOnly: true,
      });
      res.send("success");
    } else {
      res.send("error");
    }
  } catch (error) {
    res.send("error");
  }
};

module.exports = { register, login };
