import React, { useState } from "react";
import golfers from "./golfers.json";

function App() {
  const [available, setAvailable] = useState(golfers);
  const [drafted, setDrafted] = useState([]);
  const [history, setHistory] = useState([]);

  const handlePick = (golfer) => {
    setDrafted([...drafted, golfer]);
    setAvailable(available.filter((g) => g.name !== golfer.name));
    setHistory([...history, { type: "pick", golfer }]);
  };

  const undo = () => {
    const last = history.pop();
    if (last?.type === "pick") {
      setDrafted(drafted.filter((g) => g.name !== last.golfer.name));
      setAvailable([...available, last.golfer]);
    }
    setHistory([...history]);
  };

  return (
    <div>
      <h1>HFH Golf Draft: CJ Cup Byron Nelson</h1>
      <button onClick={undo}>Undo</button>
      <h2>Available Golfers</h2>
      {available.sort((a, b) => a.odds - b.odds).map((g) => (
        <button key={g.name} onClick={() => handlePick(g)}>
          {g.name} (+{g.odds})
        </button>
      ))}
      <h2>Drafted Golfers</h2>
      <ul>
        {drafted.map((g) => (
          <li key={g.name} className="drafted">{g.name} (+{g.odds})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;