const express = require("express");
const {
  getAllUsers,
  getFriends,
  getCurrentUser,
  sendFriendRequest,
} = require("../controllers/users");
const router = express.Router();

router.route("/").get(getFriends);
router.route("/user").get(getCurrentUser).patch(sendFriendRequest);

module.exports = router;
