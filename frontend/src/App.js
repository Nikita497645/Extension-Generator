import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setFiles(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      if (!data || typeof data.message !== "object") {
        setError("Invalid response ❌");
        return;
      }

      setFiles(data.message);
      setActiveTab("manifest.json");

    } catch (err) {
      console.log(err);
      setError("Server not reachable ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    Object.entries(files).forEach(([name, content]) => {
      zip.file(name, content || "// empty");
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "extension.zip");
  };

  return (
    <div className="container">
      <h1>🚀 Xtensio AI</h1>

      <textarea
        placeholder="Enter your idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="error">{error}</p>}

      {files && (
        <>
          <div className="tabs">
            {Object.keys(files).map((file) => (
              <button
                key={file}
                className={activeTab === file ? "active" : ""}
                onClick={() => setActiveTab(file)}
              >
                {file}
              </button>
            ))}
          </div>

          <div className="file-view">
            <h3>{activeTab}</h3>
            <pre>{files[activeTab]}</pre>
          </div>

          {activeTab === "popup.html" && (
            <div className="preview">
              <h3>Live Preview</h3>
              <iframe title="preview" srcDoc={files["popup.html"]} />
            </div>
          )}

          <button className="download-btn" onClick={handleDownload}>
            Download ZIP
          </button>
        </>
      )}
    </div>
  );
}

export default App;