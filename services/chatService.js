const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * question: string
 * context: optional array of { role: 'user'|'assistant', content: string }
 */
exports.chatWithAgent = async function (question, context = []) {
  const messages = [
    // system prompt
    {
      role: "system",
      content:
        "You are TripSage, a travel planning assistant. Keep replies under 100 words but informative",
    },
    // previous conversation
    ...context,
    // user’s new question
    { role: "user", content: question },
  ];

  const response = await model.chat.completions.create({
    messages,
    temperature: 0.7,
    max_output_tokens: 512,
  });

  return response.choices[0].message.content;
};
