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
      You are a Chrome Extension Generator. 
      The user wants an extension that does this: "${prompt}".

      Generate the full source code for a Manifest V3 Chrome Extension.
      
      You MUST return ONLY a JSON object with these EXACT keys:
      {
        "manifest.json": "must include manifest_version: 3, content_scripts with matches: [<all_urls>], and js: [content.js]",
        "content.js": "the actual javascript logic to perform the task",
        "popup.html": "a simple UI for the extension"
      }

      Important: The manifest.json MUST be valid Chrome Extension format, NOT a web app manifest.
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
