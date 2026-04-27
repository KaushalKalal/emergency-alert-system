import Groq from "groq-sdk";
import { chatSchema } from "../validations/alertValidation.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithBot = async (req, res, next) => {
  try {
    const { error, value } = chatSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const { message } = value;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a safety assistant chatbot called HelpBot.
          Your job is to give short, clear, practical safety advice only.
          Only answer safety related questions.
          Keep answers short — maximum 5 lines.
          If user asks anything unrelated to safety, politely say:
          "I can only help with safety related queries."`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    });

    const reply = response.choices[0].message.content.trim();

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};