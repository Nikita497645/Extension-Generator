import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setFiles(null);

    setTimeout(() => {
      const generatedFiles = {
        "manifest.json": `{
  "manifest_version": 3,
  "name": "Demo Extension",
  "version": "1.0"
}`,
        "content.js": `console.log("Extension running");`,
        "popup.html": `<h1>${prompt}</h1>`
      };

      setFiles(generatedFiles);
      setLoading(false);
    }, 1000);
  };

  const handleDownload = async () => {
    if (!files) return;

    const zip = new JSZip();

    zip.file("manifest.json", files["manifest.json"]);
    zip.file("content.js", files["content.js"]);
    zip.file("popup.html", files["popup.html"]);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "extension.zip");
  };

  return (
    <div className="container">
      <h1>🚀Xtensio.ai</h1>
      <p>Turn your ideas into Chrome Extensions instantly with AI</p>

      <textarea
        placeholder="Enter your idea here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate 👆🏻"}
      </button>

      {files && (
        <>
          <p className="success">Extension generated successfully ✅</p>

          <div className="output">
            <h2>Generated Files</h2>

            <div className="file">manifest.json</div>
            <div className="file">content.js</div>
            <div className="file">popup.html</div>

            <button className="download-btn" onClick={handleDownload}>
              ⬇ Download ZIP
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;