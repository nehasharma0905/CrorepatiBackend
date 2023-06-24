// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyDtysW7Ud2t4TZ2RVg8dp30r0Hhyp9f3HU",
  authDomain: "kbc-project-c8b2f.firebaseapp.com",
  projectId: "kbc-project-c8b2f",
  storageBucket: "kbc-project-c8b2f.appspot.com",
  messagingSenderId: "775114958342",
  appId: "1:775114958342:web:6874d562075950424bc587",
  measurementId: "G-5QE4W3V947"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseAuth : any = getAuth(app)