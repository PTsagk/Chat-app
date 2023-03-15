const Message = require("../model/Message");

const getMessages = async (req, res) => {
  try {
    const currentUser = req.user.username;
    //find if these 2 users had a conversation before
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
    //will be empty if they hadn't a conversation before
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addMessage = async (req, res) => {
  try {
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
    res.status(200).send(updateConversation);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getMessages, addMessage };
