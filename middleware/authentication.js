const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const cookie = req.headers.cookie;
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   throw new Error("Invalid authenctication");
  // }
  const token = cookie.split("=")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    res.send(error);
  }
};

module.exports = auth;
