const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },

  friends: {
    type: Array,
    info: {
      type: Object,
      username: {
        type: String,
        required: [true, "User is required"],
      },
      isFriend: {
        type: Boolean,
        default: false,
      },
    },
  },
});

module.exports = mongoose.model("Friends", friendsSchema);
