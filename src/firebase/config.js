import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgnOf033tUcap9Kk02nwFWTFWzolHXMU0",
  authDomain: "autotrack-162bd.firebaseapp.com",
  projectId: "autotrack-162bd",
  storageBucket: "autotrack-162bd.appspot.com",
  messagingSenderId: "483624732885",
  appId: "1:483624732885:web:27d797903e0256acc47a5c",
  measurementId: "G-X87L7T1NYC",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
