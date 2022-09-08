const User = require("../model/User");
const Friends = require("../model/Friends");
const ImageModel = require("../model/imageModel");
const { StatusCodes } = require("http-status-codes");
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
        console.log(err);
      } else {
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
            const user = await User.create({
              username: req.body.username,
              password: req.body.password,
              image: imageString,
            });
            await Friends.create({ username: req.body.username });
            const token = user.createJWT();
            res.cookie("token", `Bearer ${token}`, {
              secure: false,
              httpOnly: true,
            });
            res.send("success");
          })
          .catch((err) => console.log(err));
      }
    });
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
