require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. UPDATE THIS: Replace with your actual Netlify URL after deployment
app.use(cors({
  origin: "*" // While testing, "*" allows all. For security, use your Netlify URL.
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Generating for:", prompt);

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
      You are an expert Chrome Extension developer. 
      Generate a Manifest V3 extension based on this idea: "${prompt}".
      
      Return ONLY a JSON object with these keys:
      "manifest.json", "content.js", "popup.html"
      
      The values must be the actual code as a string. No markdown backticks.
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Clean and Parse
    const extensionFiles = JSON.parse(responseText);

    res.json({ message: extensionFiles });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "AI Error: " + error.message });
  }
});

app.get("/", (req, res) => res.send("Backend Live ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
