import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBjdrWMn13pfgspAU0mOXvHrRWglDUt8nk",
    authDomain: "nitrifydiscord.firebaseapp.com",
    databaseURL: "https://nitrifydiscord.firebaseio.com",
    projectId: "nitrifydiscord",
    storageBucket: "nitrifydiscord.appspot.com",
    messagingSenderId: "798820078392",
    appId: "1:798820078392:web:adb6cb638ce47e84bfe7cd",
    measurementId: "G-RYMME4JEW3"
  };

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
}
