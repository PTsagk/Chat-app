const Message = require("../model/Message");
const { StatusCodes } = require("http-status-codes");

const getMessages = async (req, res) => {
  let messages = await Message.findOne({
    username1: req.user.username,
    username2: req.body.talkingTo,
  });

  if (!messages) {
    messages = await Message.findOne({
      username1: req.body.talkingTo,
      username2: req.user.username,
    });
  }
  if (!messages) {
    messages = Message.create({
      username1: req.user.username,
      username2: req.body.talkingTo,
      messages: [],
    });
  }
  req.body.talkingTo = req.body.username2;
  res.json(messages);
};

const addMessage = async (req, res) => {
  let updateConversation = await Message.updateOne(
    { username1: req.user.username, username2: req.body.talkingTo },
    {
      $push: {
        messages: { user: req.user.username, message: req.body.message },
      },
    }
  );

  if (updateConversation.matchedCount == 0) {
    updateConversation = await Message.updateOne(
      { username1: req.body.talkingTo, username2: req.user.username },
      {
        $push: {
          messages: { user: req.user.username, message: req.body.message },
        },
      }
    );
  }
  if (updateConversation.matchedCount == 0) {
    console.log("error");
  }
  res.send(updateConversation);
};

module.exports = { getMessages, addMessage };
