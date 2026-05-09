require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Use "*" for testing to avoid CORS blocks, change to your Netlify URL later
app.use(cors({ origin: "*" }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("🚀 Request received for idea:", prompt);

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      // Force the output to be JSON format
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
      You are an expert Chrome Extension developer. 
      The user wants: "${prompt}".

      CRITICAL RULES:
      1. Do NOT just return a console log.
      2. Write actual CSS or JS logic to achieve the goal.
      3. If they ask for "darkred", you MUST use "darkred" in the code.
      4. Return ONLY valid JSON with manifest.json, content.js, and popup.html keys.
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Clean any accidental markdown and parse
    const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
    const extensionFiles = JSON.parse(cleanJsonString);

    console.log("✅ Successfully generated extension files");
    res.json({ message: extensionFiles });

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// Test route
app.get("/", (req, res) => res.send("Xtensio Backend is Online ✅"));

// Render uses dynamic ports, default to 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
