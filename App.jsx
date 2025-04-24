
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { db } from "./firebase";
import {
  ref,
  set,
  get,
  update,
  onValue
} from "firebase/database";

function App() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("regular");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [draftedTeams, setDraftedTeams] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [draftOrder, setDraftOrder] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [loading, setLoading] = useState(true);

  const picksPerTeam = eventType === "major" ? 5 : 3;

  useEffect(() => {
    const loadFromConfigAndFirebase = async () => {
      try {
        const res = await fetch("/tournament_config.json");
        const config = await res.json();
        setEventName(config.eventName);
        setDraftOrder(config.draftOrder);
        setEventType(config.type || "regular");

        const snapshot = await get(ref(db));
        const data = snapshot.val() || {};
        if (!data.availableTeams || data.availableTeams.length === 0) {
          await set(ref(db), {
            availableTeams: config.teams,
            draftedTeams: [],
            currentPickIndex: 0
          });
        }
      } catch (err) {
        console.error("Error loading config or Firebase:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFromConfigAndFirebase();

    const unsub = onValue(ref(db), (snapshot) => {
      const data = snapshot.val() || {};
      setAvailableTeams(data.availableTeams || []);
      setDraftedTeams(data.draftedTeams || []);
      setCurrentPickIndex(data.currentPickIndex || 0);
    });

    return () => unsub();
  }, []);

  const getCurrentPicker = () => {
    const round = Math.floor(currentPickIndex / draftOrder.length);
    const position = currentPickIndex % draftOrder.length;
    return round % 2 === 0
      ? draftOrder[position]
      : draftOrder[draftOrder.length - 1 - position];
  };

  const handleDraft = (teamObj) => {
    if (!teamObj || currentPickIndex >= draftOrder.length * picksPerTeam) return;

    const newDraft = {
      pick: currentPickIndex + 1,
      team: teamObj.team,
      odds: teamObj.odds,
      drafter: getCurrentPicker()
    };

    const updatedDrafted = [...draftedTeams, newDraft];
    const updatedAvailable = availableTeams.filter((t) => t.team !== teamObj.team);

    const updates = {
      draftedTeams: updatedDrafted,
      availableTeams: updatedAvailable,
      currentPickIndex: currentPickIndex + 1
    };

    update(ref(db), updates);
    setUndoStack([]);
  };

  const resetDraft = async () => {
    try {
      const res = await fetch("/tournament_config.json");
      const config = await res.json();
      setEventName(config.eventName);
      setDraftOrder(config.draftOrder);
      setEventType(config.type || "regular");
      await set(ref(db), {
        availableTeams: config.teams,
        draftedTeams: [],
        currentPickIndex: 0
      });
      setUndoStack([]);
    } catch (err) {
      console.error("Failed to reset draft:", err);
    }
  };

  const undoLastPick = () => {
    if (draftedTeams.length === 0 || currentPickIndex === 0) return;
    const lastPick = draftedTeams[draftedTeams.length - 1];
    const updatedDrafted = draftedTeams.slice(0, -1);
    const updatedAvailable = [lastPick, ...availableTeams];
    const newUndoStack = [...undoStack, lastPick];

    update(ref(db), {
      draftedTeams: updatedDrafted,
      availableTeams: updatedAvailable,
      currentPickIndex: currentPickIndex - 1
    });

    setUndoStack(newUndoStack);
  };

  const redoLastPick = () => {
    if (undoStack.length === 0 || currentPickIndex >= draftOrder.length * picksPerTeam) return;
    const redoPick = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    const updatedDrafted = [...draftedTeams, redoPick];
    const updatedAvailable = availableTeams.filter(t => t.team !== redoPick.team);

    update(ref(db), {
      draftedTeams: updatedDrafted,
      availableTeams: updatedAvailable,
      currentPickIndex: currentPickIndex + 1
    });

    setUndoStack(newUndoStack);
  };

  if (loading) return <div>Loading...</div>;

  const draftComplete = currentPickIndex >= draftOrder.length * picksPerTeam;

  return (
    <div className="app">
      <h1>HFH Draft: {eventName}</h1>
      <button onClick={resetDraft}>🔁 Reset Draft</button>
      <button onClick={undoLastPick} disabled={draftedTeams.length === 0}>↩️ Undo</button>
      <button onClick={redoLastPick} disabled={undoStack.length === 0}>↪️ Redo</button>

      <h2>Available Teams</h2>
      <div className="current-picker">
        {draftComplete
          ? "✅ Draft Complete"
          : <>⛳️ On the clock: <span>{getCurrentPicker()}</span></>}
      </div>
      <div className="team-list">
        {availableTeams.map((teamObj, idx) => (
          <button
            key={idx}
            className="team-button"
            onClick={() => handleDraft(teamObj)}
            disabled={draftComplete}
          >
            {teamObj.team} <span style={{ fontSize: "0.8em" }}>+{teamObj.odds}</span>
          </button>
        ))}
      </div>

      <h2>Draft Board</h2>
      <div className="final-results">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px" }}>Drafter</th>
              {Array.from({ length: picksPerTeam }, (_, i) => (
                <th key={i} style={{ textAlign: "left", padding: "6px" }}>
                  Pick {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draftOrder.map((drafter) => {
              const picks = draftedTeams
                .filter(e => e.drafter === drafter)
                .sort((a, b) => a.pick - b.pick);
              return (
                <tr key={drafter}>
                  <td style={{ padding: "6px", fontWeight: "bold" }}>{drafter}</td>
                  {Array.from({ length: picksPerTeam }, (_, i) => (
                    <td key={i} style={{ padding: "6px" }}>
                      {picks[i] ? `${picks[i].pick}. ${picks[i].team} (+${picks[i].odds})` : ""}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
