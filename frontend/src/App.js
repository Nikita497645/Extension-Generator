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
    setLoading(true);
    setError(null);
    try {
      // REPLACE THIS URL with your actual Render backend URL
      const response = await axios.post("https://extension-generator-backend-p4m9.onrender.com/generate", { 
        prompt 
      });

      // Fix: Check if response.data.message exists
      if (response.data && response.data.message) {
        setFiles(response.data.message);
      } else {
        throw new Error("AI response format is unexpected.");
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      setError(err.response?.data?.details || err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    if (!files) return;

    const zip = new JSZip();

    // Fix: manifest.json must be a STRING. 
    // If AI sends an object, we use JSON.stringify to convert it.
    const manifestContent = typeof files["manifest.json"] === "object"
      ? JSON.stringify(files["manifest.json"], null, 2)
      : files["manifest.json"];

    zip.file("manifest.json", manifestContent);
    zip.file("content.js", files["content.js"] || "// No content script");
    zip.file("popup.html", files["popup.html"] || "<html><body>No Popup</body></html>");

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "extension.zip");
    });
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Xtensio: AI Extension Generator</h1>
      <textarea
        placeholder="e.g. Make a background red color extension"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "80%", height: "100px", padding: "10px", borderRadius: "8px" }}
      />
      <br />
      <button 
        onClick={generateExtension} 
        disabled={loading}
        style={{ marginTop: "20px", padding: "10px 25px", cursor: "pointer" }}
      >
        {loading ? "Generating..." : "Generate Extension"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {files && (
        <div style={{ marginTop: "30px" }}>
          <h3>✅ Extension Ready!</h3>
          <button 
            onClick={downloadZip}
            style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Download .ZIP File
          </button>
          
          <div style={{ textAlign: "left", background: "#f4f4f4", padding: "20px", marginTop: "20px", borderRadius: "10px" }}>
            <h4>Preview:</h4>
            <p><strong>Name:</strong> {typeof files["manifest.json"] === 'object' ? files["manifest.json"].name : "AI Generated Extension"}</p>
            <pre style={{ fontSize: "12px" }}>{files["content.js"]}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;