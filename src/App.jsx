import { useEffect, useState } from "react";
import golfersData from "./golfers.json";

const teamNames = [
  "Connor Cremers",
  "Connor Woods",
  "Tyler Chase",
  "Kevan Elcock",
  "Trevor Elcock",
  "Brett Smith",
  "Ryne Borden",
  "Jack Berry",
  "Tyler Ehlers",
  "Tanner Morris",
  "David Johnson",
  "Kyle Serrano",
];

function App() {
  const [golfers, setGolfers] = useState([]);
  const [drafted, setDrafted] = useState([]);
  const [currentPick, setCurrentPick] = useState(0);

  useEffect(() => {
    setGolfers(golfersData);
  }, []);

  const handleDraft = (golfer) => {
    if (drafted.find((d) => d.name === golfer.name)) return;

    setDrafted((prev) => [...prev, { ...golfer, team: teamNames[currentPick % teamNames.length] }]);
    setCurrentPick((prev) => prev + 1);
  };

  const undoLastPick = () => {
    if (drafted.length === 0) return;

    setDrafted((prev) => prev.slice(0, -1));
    setCurrentPick((prev) => prev - 1);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>🏌️ HFH Golf Draft</h1>
      <h2 style={{ textAlign: "center" }}>CJ Cup at Byron Nelson</h2>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={undoLastPick} style={{ padding: "0.5rem 1rem" }}>
          Undo Last Pick
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {golfers.map((golfer, idx) => (
          <button
            key={idx}
            onClick={() => handleDraft(golfer)}
            disabled={drafted.some((d) => d.name === golfer.name)}
            style={{
              padding: "0.5rem",
              minWidth: "150px",
              backgroundColor: drafted.some((d) => d.name === golfer.name) ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {golfer.name} {golfer.odds}
          </button>
        ))}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Draft Board</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Pick 1</th>
            <th>Pick 2</th>
            <th>Pick 3</th>
            <th>Pick 4</th>
            <th>Pick 5</th>
          </tr>
        </thead>
        <tbody>
          {teamNames.map((team) => {
            const picks = drafted.filter((d) => d.team === team);
            return (
              <tr key={team}>
                <td style={{ border: "1px solid black", padding: "5px" }}>{team}</td>
                {[...Array(5)].map((_, idx) => (
                  <td key={idx} style={{ border: "1px solid black", padding: "5px" }}>
                    {picks[idx] ? picks[idx].name : ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
