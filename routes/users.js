const express = require("express");
const { getAllUsers, getCurrentUser } = require("../controllers/users");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/user").get(getCurrentUser);

module.exports = router;
