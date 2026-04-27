import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const classifyWithRules = (message) => {
  const text = message.toLowerCase();

  const highKeywords = [
    "danger", "help", "attack", "dying", "die",
    "fire", "gun", "knife", "blood", "kill",
    "rape", "kidnap", "bomb", "emergency", "urgent"
  ];

  const mediumKeywords = [
    "scared", "following", "accident", "hurt",
    "stuck", "lost", "threatened", "unsafe",
    "suspicious", "worried", "pain"
  ];

  if (highKeywords.some((word) => text.includes(word))) return "HIGH";
  if (mediumKeywords.some((word) => text.includes(word))) return "MEDIUM";
  return "LOW";
};

const classifyWithAI = async (message) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are an emergency classifier system.
        Classify the urgency of emergency messages as only LOW, MEDIUM, or HIGH.
        HIGH   → immediate threat to life, violence, fire, weapon, kidnap
        MEDIUM → scared, hurt, accident, stuck, being followed
        LOW    → general concern, feeling unsafe, suspicious activity
        Reply with one word only: LOW, MEDIUM, or HIGH.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    max_tokens: 10,
  });

  const result = response.choices[0].message.content.trim().toUpperCase();

  if (["LOW", "MEDIUM", "HIGH"].includes(result)) {
    return result;
  }

  throw new Error("Invalid AI response");
};

const classifyUrgency = async (message) => {
  try {
    const urgency = await classifyWithAI(message);
    return { urgency, classifiedBy: "AI" };
  } catch (error) {
    console.log("AI classification failed, using rules:", error.message);
    return { urgency: classifyWithRules(message), classifiedBy: "rules" };
  }
};

export default classifyUrgency;