require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Ensure GROQ_API_KEY is set in Render Environment Variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional Chrome Extension Generator.
          User Request: "${prompt}"

          You MUST return a JSON object with exactly these keys:
          1. "manifest.json": An object containing "name", "version": "1.0", "manifest_version": 3, and "content_scripts": [{"matches": ["<all_urls>"], "js": ["content.js"]}].
          2. "content.js": The Javascript logic to fulfill the request.
          3. "popup.html": A simple HTML UI.

          CRITICAL: "manifest.json" MUST be a nested object, not a string. Do not include markdown code blocks.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseData = JSON.parse(chatCompletion.choices[0].message.content);
    res.json({ message: responseData });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Generation Failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));