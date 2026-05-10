import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const generateExtension = async () => {
    if (!prompt) return alert("Please type something!");
    setLoading(true);
    setError(null);
    setFiles(null);

    try {
      // REPLACE with your actual Render URL
      const response = await axios.post("https://extension-generator-backend-p4m9.onrender.com/generate", { 
        prompt 
      });

      if (response.data && response.data.message) {
        setFiles(response.data.message);
      } else {
        throw new Error("AI returned empty data");
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    if (!files) return;
    const zip = new JSZip();

    try {
      let manifest = files["manifest.json"];
      // Auto-fix: if manifest is a string, convert to object
      if (typeof manifest === "string") manifest = JSON.parse(manifest);
      
      // Auto-fix: ensure manifest_version is an integer
      manifest.manifest_version = 3;

      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("content.js", files["content.js"] || "");
      zip.file("popup.html", files["popup.html"] || "<html><body><h3>Xtensio AI</h3></body></html>");

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "extension.zip");
      });
    } catch (e) {
      alert("ZIP Error: " + e.message);
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: 'Arial' }}>
      <h1>Xtensio: One-Click Extension</h1>
      <textarea
        placeholder="e.g. Turn all text on the page green"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "80%", height: "100px", padding: "10px" }}
      />
      <br />
      <button 
        onClick={generateExtension} 
        disabled={loading}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none" }}
      >
        {loading ? "Generating..." : "Generate & Fix Code"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {files && (
        <div style={{ marginTop: "30px" }}>
          <button 
            onClick={downloadZip}
            style={{ padding: "15px 30px", background: "green", color: "white", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            Download Ready-to-Use Extension
          </button>
          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            1. Extract Zip | 2. Go to chrome://extensions | 3. Load Unpacked
          </p>
        </div>
      )}
    </div>
  );
}

export default App;