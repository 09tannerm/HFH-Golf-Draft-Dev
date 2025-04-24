import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCutstWIZcGHAISxFFGxJ7uS81ULlQoAJ8",
  authDomain: "hfh-fantasy-golf-dev.firebaseapp.com",
  databaseURL: "https://hfh-fantasy-golf-dev-default-rtdb.firebaseio.com",
  projectId: "hfh-fantasy-golf-dev",
  storageBucket: "hfh-fantasy-golf-dev.appspot.com",
  messagingSenderId: "762826891454",
  appId: "1:762826891454:web:7550a01ddd9a527b7a3eef"
};

const app = initializeApp(firebaseConfig);
export default app;