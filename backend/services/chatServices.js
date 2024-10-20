const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

async function accessChatService(usr1, usr2) {
  console.log("accessChat service call!");

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: usr2 } } },
      { users: { $elemMatch: { $eq: usr1 } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return isChat[0];
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [usr2, usr1],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return FullChat;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = {
  accessChatService,
};
