const express = require("express");
const router = express.Router();
const { getMessages, addMessage } = require("../controllers/messages");

router.route("/").post(getMessages);
router.route("/add").post(addMessage);

module.exports = router;
