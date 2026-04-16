require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const promptText = `
You are a JSON generator.

Strictly return ONLY valid JSON.
Do NOT add explanation.
Do NOT add text before or after JSON.

Format exactly like this:

{
  "manifest.json": "string",
  "popup.html": "string",
  "content.js": "string"
}

Make sure:
- All values are properly escaped
- No markdown (no \`\`\`)
- No comments

User request: ${prompt}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
    });

    let response = result.response.text();

// 🔥 Remove unwanted text (if AI adds extra)
response = response.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

    res.json({ message: response });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "API limit reached, try later" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});