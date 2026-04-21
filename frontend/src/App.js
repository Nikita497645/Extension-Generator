import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatus("Please enter something first ❌");
      return;
    }

    setLoading(true);
    setFiles(null);
    setStatus("Generating...");

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const parsed = JSON.parse(data.message);

      setFiles(parsed);
      setStatus("Extension generated successfully ✅");
    } catch (error) {
      setStatus("Error occurred ❌");
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    zip.file("manifest.json", files["manifest.json"]);
    zip.file("content.js", files["content.js"]);
    zip.file("popup.html", files["popup.html"]);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "extension.zip");
  };

  return (
    <div className="container">

      <h1>Xtensio.ai</h1>
      <p className="tagline">Create Chrome Extensions without coding</p>

      <textarea
        placeholder="Enter your idea here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Status Message */}
      {status && <p className="status">{status}</p>}

      {/* Output */}
      {files && (
        <div className="output">
          <button onClick={handleDownload}>Download</button>

          <div className="file-card">manifest.json</div>
          <div className="file-card">content.js</div>
          <div className="file-card">popup.html</div>
        </div>
      )}
    </div>
  );
}

export default App;