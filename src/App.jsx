
import React, { useState, useEffect } from "react";
import golfersData from "./golfers.json";

const DRAFTERS = [
  "Connor Cremers", "Connor Woods", "Tyler Chase", "Kevan Elcock",
  "Trevor Elcock", "Brett Smith", "Ryne Borden", "Jack Berry",
  "Tyler Ehlers", "Tanner Morris", "David Johnson", "Kyle Serrano"
];

const TOURNAMENT_TYPE = "regular"; // or "major"
const PICKS_PER_USER = TOURNAMENT_TYPE === "major" ? 5 : 3;

const App = () => {
  const [availableGolfers, setAvailableGolfers] = useState(golfersData);
  const [drafted, setDrafted] = useState({});
  const [pickNumber, setPickNumber] = useState(0);
  const [history, setHistory] = useState([]);

  const totalPicks = PICKS_PER_USER * DRAFTERS.length;
  const currentDrafter = DRAFTERS[
    pickNumber % (2 * DRAFTERS.length) < DRAFTERS.length
      ? pickNumber % DRAFTERS.length
      : DRAFTERS.length - 1 - (pickNumber % DRAFTERS.length)
  ];

  const draftGolfer = (golfer) => {
    if (Object.values(drafted).flat().includes(golfer.name)) return;

    const newDrafted = { ...drafted };
    if (!newDrafted[currentDrafter]) newDrafted[currentDrafter] = [];
    if (newDrafted[currentDrafter].length >= PICKS_PER_USER) return;

    newDrafted[currentDrafter].push(golfer.name);
    setHistory([...history, { golfer, drafter: currentDrafter }]);
    setDrafted(newDrafted);
    setAvailableGolfers(availableGolfers.filter(g => g.name !== golfer.name));
    setPickNumber(pickNumber + 1);
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;

    const newDrafted = { ...drafted };
    newDrafted[last.drafter] = newDrafted[last.drafter].filter(name => name !== last.golfer.name);
    setDrafted(newDrafted);
    setAvailableGolfers([...availableGolfers, last.golfer]);
    setHistory(history.slice(0, -1));
    setPickNumber(pickNumber - 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>HFH Golf Draft</h1>
      <h2>On the clock: {currentDrafter}</h2>
      <button onClick={undo} disabled={history.length === 0}>Undo</button>

      <h3>Available Golfers</h3>
      {availableGolfers
        .sort((a, b) => a.odds - b.odds)
        .map((g) => (
          <button
            key={g.name}
            onClick={() => draftGolfer(g)}
            style={{ margin: 5 }}
          >
            {g.name} (+{g.odds})
          </button>
        ))}

      <h3>Draft Board</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {DRAFTERS.map(drafter => (
          <div key={drafter} style={{ margin: 10 }}>
            <strong>{drafter}</strong>
            <ul>
              {(drafted[drafter] || []).map(g => <li key={g}>{g}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
