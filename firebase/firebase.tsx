import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBqUmYO3KznEJaSzfHkwh3ULX-LNoR8f1c",
    authDomain: "medical-dd248.firebaseapp.com",
    projectId: "medical-dd248",
    storageBucket: "medical-dd248.appspot.com",
    messagingSenderId: "518789872630",
    appId: "1:518789872630:web:26312948308685fde225d7",
    measurementId: "G-KK8QYSE6NS"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
