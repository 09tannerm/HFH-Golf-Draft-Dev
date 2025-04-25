import React, { useState } from "react";
import golfers from "./golfers.json";
import "./style.css";

function App() {
  const [drafted, setDrafted] = useState([]);
  const [history, setHistory] = useState([]);

  const handleDraft = (golfer) => {
    setHistory([...history, drafted]);
    setDrafted([...drafted, golfer]);
  };

  const undo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setDrafted(previous);
    }
  };

  const redo = () => {
    // Placeholder for redo logic
    alert("Redo is not implemented yet.");
  };

  return (
    <div className="App">
      <h1>HFH Golf Draft</h1>
      <div className="controls">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
      <div className="draft-board">
        <h2>Available Golfers</h2>
        <ul>
          {golfers.filter(g => !drafted.includes(g.name)).map((golfer, index) => (
            <li key={index}>
              <button onClick={() => handleDraft(golfer.name)}>
                {golfer.name} ({golfer.odds})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="summary">
        <h2>Drafted</h2>
        <ol>
          {drafted.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
