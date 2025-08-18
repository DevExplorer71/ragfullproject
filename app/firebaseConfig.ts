import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1NrJ93oypp3ZZJA1Rna3CwDDFcnMziHs",
  authDomain: "myragexample.firebaseapp.com",
  projectId: "myragexample",
  storageBucket: "myragexample.firebasestorage.app",
  messagingSenderId: "189231428527",
  appId: "1:189231428527:web:0595fdd067a1b278f0b55a",
  measurementId: "G-J5FXL4N367"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
