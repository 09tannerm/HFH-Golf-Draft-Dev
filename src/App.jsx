import { useState, useEffect } from 'react';
import golfers from './golfers.json';
import './style.css';

export default function App() {
  const [availableGolfers, setAvailableGolfers] = useState(golfers);
  const [draftedGolfers, setDraftedGolfers] = useState([]);
  const [currentPick, setCurrentPick] = useState(0);
  const draftOrder = [
    'Connor Cremers', 'Connor Woods', 'Tyler Chase', 'Kevan Elcock',
    'Trevor Elcock', 'Brett Smith', 'Ryne Borden', 'Jack Berry',
    'Tyler Ehlers', 'Tanner Morris', 'David Johnson', 'Kyle Serrano'
  ];

  function handleDraft(golfer) {
    setDraftedGolfers([...draftedGolfers, { ...golfer, drafter: draftOrder[currentPick % draftOrder.length] }]);
    setAvailableGolfers(availableGolfers.filter(g => g.name !== golfer.name));
    setCurrentPick(currentPick + 1);
  }

  return (
    <div className="app">
      <h1>HFH Golf Draft</h1>
      <h2>CJ Cup Byron Nelson</h2>
      <h3>On the clock: {draftOrder[currentPick % draftOrder.length]}</h3>

      <div className="golfers-list">
        {availableGolfers.map(golfer => (
          <button key={golfer.name} onClick={() => handleDraft(golfer)}>
            {golfer.name} ({golfer.odds})
          </button>
        ))}
      </div>

      <div className="draft-board">
        <h2>Draft Board</h2>
        {draftOrder.map(drafter => (
          <div key={drafter}>
            <strong>{drafter}:</strong>
            {draftedGolfers.filter(g => g.drafter === drafter).map((g, idx) => (
              <span key={idx}> {g.name}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
