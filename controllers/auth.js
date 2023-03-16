const User = require("../model/User");
const Friends = require("../model/Friends");
const ImageModel = require("../model/imageModel");
const multer = require("multer");
const path = require("path");

// storage
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");

//Register user
const register = async (req, res) => {
  try {
    let imageString = "";

    upload(req, res, (err) => {
      if (err) {
        return res.status(500).send("Error on image uplaod");
      }

      // image = req.file.filename;
      const newImage = new ImageModel({
        name: req.body.username,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      imageString = req.file.filename;
      newImage
        .save()
        .then(async () => {
          let { username, password } = req.body;
          console.log(req.body);
          if (!username || !password) {
            return res.status(400).send("Bad request");
          }
          //remove white spaces
          username = username.replace(/\s/g, "");
          password = password.replace(/\s/g, "");
          const user = await User.create({
            username: username,
            password: password,
            image: imageString,
          });
          await Friends.create({ username: req.body.username });
          const token = user.createJWT();
          res.cookie("token", `Bearer ${token}`, {
            secure: false,
            httpOnly: true,
          });
          return res.status(200).send("success");
        })
        .catch((err) => res.status(500).send(err));
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

//Login user
const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.replace(/\s/g, "");
    password = password.replace(/\s/g, "");
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(404).send("User not found");
    }
    const token = user.createJWT();
    res.cookie("token", `Bearer ${token}`, {
      secure: false,
      httpOnly: true,
    });
    return res.status(200).send("success");
  } catch (error) {
    return res.status(500).send(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.end();
};

module.exports = { register, login, logout };
