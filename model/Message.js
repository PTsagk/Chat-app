const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username1: {
    type: String,
    required: [true, "Id is required"],
  },
  username2: {
    type: String,
    required: [true, "Id is required"],
  },
  messages: {
    type: Array,
    message: {
      type: Object,
      user: {
        type: String,
        required: [true, "User is required"],
      },
      message: {
        type: String,
        required: [true, "Message is required"],
      },
    },
  },
});

module.exports = mongoose.model("Message", messageSchema);
