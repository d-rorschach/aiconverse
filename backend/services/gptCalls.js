// Import the OpenAI package
const openai = require("./openaiClient");

// Function to list available models
async function listModels() {
  try {
    const response = await openai.listModels();
    console.log(response.data);
    // Uncomment if you want to log each model's ID
    // response.data.data.forEach((model) => {
    //     console.log(model.id);
    // });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

// Function to analyze a conversation using OpenAI's GPT-3.5 Turbo
async function analyzeConversation(prompt, conversationText) {
  try {
    const gptInput = `
      ${prompt}
      Conversation:
      ${conversationText}

      Analysis:
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptInput }],
    });

    // Return the response content
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing conversation:", error);
  }
}

async function getChatSuggestion(prompt, conversationText) {
  try {
    const gptInput = `
      ${prompt}
      Conversation:
      ${conversationText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptInput }],
    });

    // Return the response content
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing conversation:", error);
  }
}

module.exports = {
  getChatSuggestion,
  analyzeConversation,
};
