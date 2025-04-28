import { useState } from 'react';
import golfers from './golfers.json';
import './style.css';

const teamNames = [
  "Connor Cremers", "Connor Woods", "Tyler Chase", "Kevan Elcock",
  "Trevor Elcock", "Brett Smith", "Ryne Borden", "Jack Berry",
  "Tyler Ehlers", "Tanner Morris", "David Johnson", "Kyle Serrano"
];

export default function App() {
  const [draftedGolfers, setDraftedGolfers] = useState([]);
  const [currentPick, setCurrentPick] = useState(0);
  const totalRounds = 5;

  const currentTeam = teamNames[
    Math.floor(currentPick / totalRounds) % teamNames.length
  ];

  const handleDraft = (golfer) => {
    if (!draftedGolfers.includes(golfer.name)) {
      setDraftedGolfers([...draftedGolfers, golfer.name]);
      setCurrentPick(currentPick + 1);
    }
  };

  return (
    <div className="app">
      <h1>CJ Cup Byron Nelson Draft</h1>
      <h2>On the clock: {currentTeam}</h2>

      <div className="golfers-list">
        {golfers.map((golfer, idx) => (
          <button key={idx} onClick={() => handleDraft(golfer)}>
            {golfer.name} ({golfer.odds})
          </button>
        ))}
      </div>

      <h2>Draft Board</h2>
      <ul>
        {draftedGolfers.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
