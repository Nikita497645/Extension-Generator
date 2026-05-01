require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ BACKEND RUNNING");

// Test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// Main route (SAFE VERSION)
app.post("/generate", (req, res) => {
  console.log("🔥 API HIT");

  const { prompt } = req.body;

  // Always return safe data
  res.json({
    message: {
      "manifest.json": `{
  "manifest_version": 3,
  "name": "Demo Extension",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html"
  }
}`,
      "popup.html": `
        <html>
          <body>
            <h1>${prompt || "Hello Extension"}</h1>
            <p>Frontend + Backend working ✅</p>
          </body>
        </html>
      `,
      "content.js": `console.log("Extension running");`,
    },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});