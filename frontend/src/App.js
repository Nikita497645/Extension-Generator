import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setFiles(null);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      try {
  const parsed = JSON.parse(data.message);
  setFiles(parsed);
} catch (err) {
  console.log("RAW AI RESPONSE:", data.message);
  alert("Still invalid JSON ❌ Check console");
}

    } catch (error) {
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    zip.file("manifest.json", files["manifest.json"]);
    zip.file("popup.html", files["popup.html"]);
    zip.file("content.js", files["content.js"]);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "extension.zip");
  };

  return (
    <div className="container">
      <h1>🚀 Chrome Extension Generator</h1>

      <div className="input-box">
        <textarea
          placeholder="Enter your idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {files && (
        <div className="output">
          <h2>Generated Files</h2>

          <div className="file-card">
            <h3>manifest.json</h3>
            <pre>{files["manifest.json"]}</pre>
          </div>

          <div className="file-card">
            <h3>popup.html</h3>
            <pre>{files["popup.html"]}</pre>
          </div>

          <div className="file-card">
            <h3>content.js</h3>
            <pre>{files["content.js"]}</pre>
          </div>

          <button className="download-btn" onClick={handleDownload}>
            ⬇ Download ZIP
          </button>
        </div>
      )}
    </div>
  );
}

export default App;