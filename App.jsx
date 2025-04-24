
import React, { useEffect, useState } from "react";
import { setupNotifications } from "./firebase";

export default function App() {
  const [currentDrafterName, setCurrentDrafterName] = useState("Connor Cremers");

  useEffect(() => {
    if (currentDrafterName) {
      setupNotifications(currentDrafterName);
    }
  }, [currentDrafterName]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>HFH Golf Draft</h1>
      <p>Welcome, {currentDrafterName}!</p>
      <p>Push notification setup is active. You’ll get alerts when it’s your turn.</p>
    </div>
  );
}
