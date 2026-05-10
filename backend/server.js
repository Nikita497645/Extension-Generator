require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk"); // Pehle terminal mein 'npm install groq-sdk' karna

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

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
          Return ONLY a JSON object with: 
          "manifest.json", "content.js", and "popup.html". 
          Do NOT use 'Demo' names. Use specific logic for the user's request.`
        }
      ],
      model: "llama-3.3-70b-versatile", // Best free model in 2026
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    res.json({ message: JSON.parse(responseText) });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Generation Failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));