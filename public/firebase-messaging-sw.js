
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCystWtIZcGHAISxFFGxJ7uS81ULlQoAJ0",
  authDomain: "hfh-fantasy-golf-dev.firebaseapp.com",
  projectId: "hfh-fantasy-golf-dev",
  messagingSenderId: "762826891454",
  appId: "1:762826891454:web:7550a01dd9a527b7a3eef",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
