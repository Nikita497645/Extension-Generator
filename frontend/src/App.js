import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Extension Generator</h2>

      <textarea
        rows="5"
        cols="50"
        placeholder="Enter your idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br /><br />

      <button onClick={handleGenerate}>Generate</button>

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;