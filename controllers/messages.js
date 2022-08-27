const Message = require("../model/Message");

const getMessages = async (req, res) => {
  const currentUser = req.user.username;
  let messages = await Message.findOne({
    username1: currentUser,
    username2: req.body.talkingTo,
  });

  if (!messages) {
    messages = await Message.findOne({
      username1: req.body.talkingTo,
      username2: currentUser,
    });
  }
  if (!messages) {
    messages = Message.create({
      username1: currentUser,
      username2: req.body.talkingTo,
      messages: [],
    });
  }
  res.json(messages);
};

const addMessage = async (req, res) => {
  const currentUser = req.user.username;
  let updateConversation = await Message.updateOne(
    { username1: currentUser, username2: req.body.talkingTo },
    {
      $push: {
        messages: { user: currentUser, message: req.body.message },
      },
    }
  );

  if (updateConversation.matchedCount == 0) {
    updateConversation = await Message.updateOne(
      { username1: req.body.talkingTo, username2: currentUser },
      {
        $push: {
          messages: { user: currentUser, message: req.body.message },
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
