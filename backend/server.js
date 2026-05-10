require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Make sure you have GROQ_API_KEY in your Render Environment Variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Chrome Extension Developer. 
          User Request: "${prompt}"
          Return ONLY a valid JSON object with these EXACT keys:
          "manifest.json": A nested object (NOT a string) containing name, version, manifest_version: 3, and permissions.
          "content.js": The javascript code as a string.
          "popup.html": The HTML code as a string.
          
          CRITICAL: Do not include any markdown, backticks, or extra text. Just the JSON.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    const extensionData = JSON.parse(responseText);
    
    res.json({ message: extensionData });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "AI Generation Failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));