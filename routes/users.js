const express = require("express");
const {
  getAllUsers,
  getFriends,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  getUserImage,
} = require("../controllers/users");
const router = express.Router();

router
  .route("/")
  .get(getFriends)
  .patch(acceptFriendRequest)
  .delete(deleteFriendRequest);
router.route("/user").get(getCurrentUser).patch(sendFriendRequest);
router.route("/image").post(getUserImage);

module.exports = router;
