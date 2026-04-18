import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setFiles(null);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        console.log("RAW:", data.raw);
        return;
      }

      setFiles(data.message);

    } catch (err) {
      setError("Server error ❌");
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied ✅");
  };

  return (
    <div className="container">
      <h1>🚀 Xtensio AI </h1>

      <textarea
        placeholder="Enter your idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="error">{error}</p>}

      {files && (
        <div className="output">
          {Object.entries(files).map(([name, content]) => (
            <div className="file-card" key={name}>
              <h3>{name}</h3>

              <button onClick={() => copyToClipboard(content)}>
                Copy
              </button>

              <pre>{content}</pre>
            </div>
          ))}

          <button className="download-btn" onClick={handleDownload}>
            Download ZIP
          </button>
        </div>
      )}
    </div>
  );
}

export default App;