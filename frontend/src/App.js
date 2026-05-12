import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";


const BACKEND_URL = "https://extension-generator-backend.onrender.com/generate";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const generateExtension = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setFiles(null);

    try {
      const response = await axios.post(BACKEND_URL, { prompt });
      
      if (response.data && response.data.message) {
        setFiles(response.data.message);
      } else {
        throw new Error("AI ne response nahi diya.");
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Server connect nahi ho raha. URL check karein!");
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    const zip = new JSZip();
    try {
      let manifest = files["manifest.json"];
      if (typeof manifest === "string") manifest = JSON.parse(manifest);
      
      manifest.manifest_version = 3;
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("content.js", files["content.js"] || "");
      zip.file("popup.html", files["popup.html"] || "<html></html>");
      
      zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "xtensio_pro.zip");
      });
    } catch (e) {
      alert("ZIP Error: " + e.message);
    }
  };

  return (
    <>
      <div className="background-glow"></div>
      <div className="container">
        <div className="badge">AI BUILDER</div>
        <h1>Xtensio <span className="gradient-text">Pro 🚀</span></h1>
        <p style={{color: '#94a3b8', fontSize: '14px'}}>Build and deploy production-ready Chrome extensions in a single click.</p>

        <textarea
          placeholder="e.g. Turn all images grayscale"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button className="generate-btn" onClick={generateExtension} disabled={loading}>
          {loading ? "Generating..." : "Generate Extension ✨"}
        </button>

        {error && <p style={{ color: "#ff4d4d", fontSize: '14px' }}>{error}</p>}

        {files && (
          <div className="success-card">
            <div>
              <h4 style={{margin: 0}}>Files Ready!</h4>
              <span style={{fontSize: '11px', color: '#94a3b8'}}>Ready to install.</span>
            </div>
            <button className="download-btn" onClick={downloadZip}>Download</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;