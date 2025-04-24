
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCystWtIZcGHAISxFFGxJ7uS81ULlQoAJ0",
  authDomain: "hfh-fantasy-golf-dev.firebaseapp.com",
  projectId: "hfh-fantasy-golf-dev",
  storageBucket: "hfh-fantasy-golf-dev.appspot.com",
  messagingSenderId: "762826891454",
  appId: "1:762826891454:web:7550a01dd9a527b7a3eef",
  databaseURL: "https://hfh-fantasy-golf-dev-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messaging = getMessaging(app);

// Ask for permission and store token under the current drafter
export async function setupNotifications(currentDrafterName) {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BB0XH4NgkoxB-zrJhWeWJLuCvYekg7EbYO9Aj63ZvhFTjG-XwaCis8nHoVo9TcS_rIQtbf05hMplzQ0ZhxLB0Gc"
    });

    if (token) {
      await set(ref(db, "fcmTokens/" + currentDrafterName), token);
      console.log("Notification token saved for", currentDrafterName);
    } else {
      console.warn("No token received. Notifications not permitted?");
    }
  } catch (err) {
    console.error("Error getting token:", err);
  }
}

// Listen for foreground messages (optional)
onMessage(messaging, (payload) => {
  console.log("Message received in foreground:", payload);
});
