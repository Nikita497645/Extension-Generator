import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setResponse(data.message);
    } catch (error) {
      console.log(error);
      setResponse("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Generator</h2>

      <textarea
        rows="5"
        cols="50"
        placeholder="Enter something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br /><br />

      <button onClick={handleClick}>Generate</button>

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;