import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. UPDATE THIS URL
  const BACKEND_URL = "https://extension-generator-backend-p4m9.onrender.com/generate";

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setFiles(null);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Generation failed");

      // Set the file object into state
      setFiles(res.data.message);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!files) return;
    const zip = new JSZip();

    // Loop through the object keys and add to ZIP
    zip.file("manifest.json", files["manifest.json"]);
    zip.file("content.js", files["content.js"]);
    zip.file("popup.html", files["popup.html"]);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "extension.zip");
  };

  return (
    <div className="container">
      <h1>🚀 Xtensio.ai</h1>
      <p>Instant Chrome Extensions from your ideas</p>

      <textarea
        placeholder="e.g., An extension that makes all images on a page rotate 180 degrees"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Magic in progress..." : "Generate Extension"}
      </button>

      {files && (
        <div className="output">
          <p className="success">Ready for download! ✅</p>
          <div className="file-list">
            <span>📄 manifest.json</span>
            <span>📄 content.js</span>
            <span>📄 popup.html</span>
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