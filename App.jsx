
import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import DraftApp from "./DraftApp";

const firebaseConfig = {
  apiKey: "AIzaSyCutsWITZcGHAISxFFGxJ7uS81ULlQoAJ0",
  authDomain: "hfh-fantasy-golf-dev.firebaseapp.com",
  projectId: "hfh-fantasy-golf-dev",
  storageBucket: "hfh-fantasy-golf-dev.appspot.com",
  messagingSenderId: "762826891454",
  appId: "1:762826891454:web:7550a01ddd9a527b7a3eef",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

function App() {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY_HERE"
        }).then((currentToken) => {
          if (currentToken) {
            console.log("Push token:", currentToken);
            // Store or send token to backend
          } else {
            console.warn("No registration token available.");
          }
        }).catch((err) => {
          console.error("An error occurred while retrieving token. ", err);
        });
      } else {
        console.log("Notification permission denied");
      }
    });

    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      alert(payload.notification.title + "\n" + payload.notification.body);
    });
  }, []);

  return (
    <div>
      <h2>HFH Draft</h2>
      <p>Push notification service is active. You’ll get alerts when it’s your turn.</p>
      <DraftApp />
    </div>
  );
}

export default App;
