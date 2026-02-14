const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/chat", async (req, res) => {
  try {
    const { message, skills } = req.body;

    const prompt = `
You are a professional AI career assistant for college students.

Student skills:
${skills && skills.length ? skills.join(", ") : "No skills provided"}

User question:
${message}

Respond like ChatGPT with detailed, professional advice.
`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        }
    );


    const data = await response.json();

    // 🔍 DEBUG LOG (IMPORTANT)
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini REST Error:", error.message);
    res.status(500).json({
      reply: "AI service is not responding. Please try again.",
    });
  }
});

module.exports = router;
