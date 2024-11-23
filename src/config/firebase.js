import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyArDJASpomqJQqE3WYSA8izInqZnQy4VMk",
  authDomain: "work-tracker-c6900.firebaseapp.com",
  projectId: "work-tracker-c6900",
  storageBucket: "work-tracker-c6900.firebasestorage.app",
  messagingSenderId: "839508399748",
  appId: "1:839508399748:web:4f598080194ad3cef654d1",
  measurementId: "G-0Y6MMF794Z"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
