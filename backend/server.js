require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const response = result.response.text();

    res.json({
      message: response,
    });

  } catch (error) {
    console.error("FULL ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});