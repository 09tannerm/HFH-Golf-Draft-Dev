import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCystWTtZcGHAISxFFGxJ7uS81ULlQoAJ0",
  authDomain: "hfh-fantasy-golf-dev.firebaseapp.com",
  databaseURL: "https://hfh-fantasy-golf-dev-default-rtdb.firebaseio.com",
  projectId: "hfh-fantasy-golf-dev",
  storageBucket: "hfh-fantasy-golf-dev.appspot.com",
  messagingSenderId: "762826891454",
  appId: "1:762826891454:web:7550a01dd9a527b7a3eef"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
