const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let cookies = req.headers?.cookie;
    if (!cookies) {
      res.status(401).send("Invalid Authentication");
    }
    cookies = cookies.split(";");
    let token = "";
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0];
      const value = cookie.split("=")[1];
      if (name == "token") {
        token = value;
      }
    });
    if (!token || !token.startsWith("Bearer")) {
      res.status(401).send("Invalid Authentication");
    }

    token = token.split("%20")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    req.user = "error";
    res.status(500).send(error);
  }
};

module.exports = auth;
