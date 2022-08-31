const express = require("express");
const {
  getAllUsers,
  getFriends,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
} = require("../controllers/users");
const router = express.Router();

router.route("/").get(getFriends).patch(acceptFriendRequest).delete(deleteFriendRequest);
router.route("/user").get(getCurrentUser).patch(sendFriendRequest);

module.exports = router;
