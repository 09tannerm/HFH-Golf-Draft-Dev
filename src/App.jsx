import React, { useState } from "react";
import golfers from "./tournament_config.json";

const drafters = [
  "Connor Cremers", "Connor Woods", "Tyler Chase", "Kevan Elcock",
  "Trevor Elcock", "Brett Smith", "Ryne Borden", "Jack Berry",
  "Tyler Ehlers", "Tanner Morris", "David Johnson", "Kyle Serrano"
];

const App = () => {
  const [draft, setDraft] = useState(Array(drafters.length).fill([]));
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const isMajor = true; // 5 picks if major, 3 otherwise
  const picksPerTeam = isMajor ? 5 : 3;

  const totalRounds = picksPerTeam;
  const currentTeamIndex = round % drafters.length;
  const isReversed = Math.floor(round / drafters.length) % 2 === 1;
  const displayOrder = isReversed ? [...drafters].reverse() : drafters;
  const teamName = displayOrder[round % drafters.length];

  const makePick = (golfer) => {
    const newDraft = [...draft];
    const teamIdx = drafters.indexOf(teamName);
    newDraft[teamIdx] = [...newDraft[teamIdx], golfer];
    setHistory([...history, { draft, round }]);
    setDraft(newDraft);
    setRound(round + 1);
  };

  const undo = () => {
    if (history.length > 0) {
      const last = history.pop();
      setDraft(last.draft);
      setRound(last.round);
      setHistory([...history]);
    }
  };

  return (
    <>
      <h2>On the clock: {teamName}</h2>
      <div>
        {golfers.filter(g => !draft.flat().includes(g.name)).map((g, idx) => (
          <button key={idx} onClick={() => makePick(g.name)}>
            {g.name} ({g.odds})
          </button>
        ))}
      </div>
      <button onClick={undo} disabled={history.length === 0}>Undo</button>
      <h3>Draft Board</h3>
      <table>
        <thead>
          <tr><th>Team</th>{Array.from({ length: picksPerTeam }, (_, i) => <th key={i}>Round {i + 1}</th>)}</tr>
        </thead>
        <tbody>
          {drafters.map((team, i) => (
            <tr key={i}>
              <td className="team-column">{team}</td>
              {Array.from({ length: picksPerTeam }, (_, j) => <td key={j}>{draft[i][j] || ""}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
