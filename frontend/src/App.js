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
      const parsed = JSON.parse(data.message);

      setFiles(parsed);
    } catch (error) {
      alert("Error generating extension");
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

      {/* Header */}
      <h1>Xtensio.ai</h1>
      <p className="tagline">Create Chrome Extensions without coding</p>

      {/* Input */}
      <textarea
        placeholder="Enter your idea here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Output */}
      {files && (
        <div className="output">
          <h3>Extension generated successfully</h3>

          <button onClick={handleDownload}>Download</button>

          <ul>
            <li>manifest.json</li>
            <li>content.js</li>
            <li>popup.html</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;