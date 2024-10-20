const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { getAiConverse } = require("../services/gptCalls");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, aiPrompt } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    // AI reply
    const aiReplyContent = await getAiConverse(aiPrompt, content);
    console.log("ai reply: ", aiReplyContent);
    const aiUserId =
      message.chat.users[0]._id == req.user._id
        ? message.chat.users[1]._id
        : message.chat.users[0]._id;
    var newAiReply = {
      sender: aiUserId,
      content: aiReplyContent,
      chat: chatId,
    };
    var aiReply = await Message.create(newAiReply);

    aiReply = await aiReply.populate("sender", "name pic").execPopulate();
    aiReply = await aiReply.populate("chat").execPopulate();
    aiReply = await User.populate(aiReply, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    console.log("newAiReply: ", aiReply);
    console.log("message test: ", message);

    res.json({ message, newAiReply });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
