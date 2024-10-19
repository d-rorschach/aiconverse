const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const {
  getChatSuggestion,
  analyzeConversation,
} = require("../services/gptCalls");

//@description     Get ai chat suggestion based on last chat
//@route           POST /api/ai/get/chat/suggestion/
//@access          Protected
const getChatSuggestionController = asyncHandler(async (req, res) => {
  try {
    const { chatId, prompt } = req.body;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    const lastMessage = messages[messages.length - 1]?.content;
    console.log("clling gpt for this input: ", lastMessage);

    const aiChatSuggestionResponse = await getChatSuggestion(
      prompt,
      lastMessage
    );
    console.log("ai chat suggestion response: ", aiChatSuggestionResponse);
    res.json(aiChatSuggestionResponse);
  } catch (error) {
    console.log("error in getChatSuggestion: ", error.message);
    res.status(500);
    throw new Error(error.message);
  }
});

//@description     Get ai chat analysis based on last 5 chats
//@route           POST /api/ai/get/chat/analyze/
//@access          Protected
const getChatAnalysisController = asyncHandler(async (req, res) => {
  try {
    const { chatId, prompt } = req.body;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    const last5Message = [];

    for (let i = 0; i < messages.length && i < 5; i++) {
      last5Message.push(messages[messages.length - 1 - i]?.content);
    }
    console.log("clling gpt for this input: ", last5Message);

    const aiChatSuggestionResponse = await analyzeConversation(
      prompt,
      last5Message
    );
    console.log("ai chat suggestion response: ", aiChatSuggestionResponse);
    res.json(aiChatSuggestionResponse);
  } catch (error) {
    console.log("error in getChatSuggestion: ", error.message);
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getChatSuggestionController,
  getChatAnalysisController,
};
