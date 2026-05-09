require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. SECURITY: Open CORS so Netlify can talk to Render
app.use(cors({ origin: "*" }));
app.use(express.json());

// 2. INITIALIZE GOOGLE AI
// Ensure GEMINI_API_KEY is set in your Render Environment Variables!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "No prompt provided" });
  }

  try {
    // Using the 'latest' tag to avoid 404 version errors
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
    });

    // 3. FORCE DYNAMIC SYSTEM PROMPT
    const systemPrompt = `
      You are a professional Chrome Extension Developer.
      The user's specific request is: "${prompt}".

      TASK: Write a Manifest V3 extension that fulfills this request perfectly.
      
      CRITICAL INSTRUCTIONS:
      - DO NOT use the name "Demo Extension" or "Sample". Use a unique name based on the idea.
      - DO NOT return a simple 'console.log'. 
      - The 'content.js' MUST contain actual logic (e.g., document.body.style, querySelectors, etc.).
      - Ensure 'manifest.json' includes: manifest_version: 3, name, version, and content_scripts.
      - The 'content_scripts' MUST match "<all_urls>".

      YOU MUST RETURN ONLY THIS JSON STRUCTURE:
      {
        "manifest.json": "string containing the full manifest code",
        "content.js": "string containing the full javascript logic",
        "popup.html": "string containing a simple UI"
      }
    `;

    console.log("🤖 AI is thinking about:", prompt);
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // 4. CLEAN AND PARSE THE AI RESPONSE
    // This removes any markdown backticks if Gemini accidentally adds them
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const extensionFiles = JSON.parse(cleanJson);

    console.log("✅ Extension Generated Successfully!");

    // Send the JSON object directly back to the frontend
    res.json({ message: extensionFiles });

  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    res.status(500).json({ 
        error: "AI Generation Failed", 
        details: error.message 
    });
  }
});

// Root route for health check
app.get("/", (req, res) => res.send("Xtensio API is Live and Dynamic! 🚀"));

// 5. DYNAMIC PORT FOR RENDER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});