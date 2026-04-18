require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 👉 Use stable model (important for quota)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// Main API
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      message: "Prompt is required",
    });
  }

  try {
    // 🔥 Strong prompt for clean JSON
    const promptText = `
You are a strict JSON generator.

Return ONLY valid JSON.
Do NOT add explanation.
Do NOT add markdown.
Do NOT add backticks.

Format:
{
  "manifest.json": "...",
  "popup.html": "...",
  "content.js": "..."
}

User request: ${prompt}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    });

    let response = result.response.text();

    // 🔥 Clean unwanted formatting
    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("RAW AI RESPONSE:\n", response);

    // 🔥 Try parsing JSON
    let parsedData;
    try {
      parsedData = JSON.parse(response);
    } catch (err) {
      console.log("JSON ERROR:", err.message);

      return res.status(400).json({
        message: "Invalid JSON from AI ❌",
        raw: response,
      });
    }

    // ✅ Send clean JSON to frontend
    res.json({
      message: parsedData,
    });

  } catch (error) {
    console.error("FULL ERROR:", error.message);

    // 🔥 Handle quota error clearly
    if (error.message.includes("429")) {
      return res.status(429).json({
        message: "API limit reached. Please try later.",
      });
    }

    res.status(500).json({
      message: "Server error ❌",
    });
  }
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});