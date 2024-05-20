// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrXgVzW1hSmqzB1KtPW5fDyK5dvwqTfSA",
  authDomain: "finalyearvirtualtalk.firebaseapp.com",
  projectId: "finalyearvirtualtalk",
  storageBucket: "finalyearvirtualtalk.appspot.com",
  messagingSenderId: "521514286544",
  appId: "1:521514286544:web:6049f815acc2398d274dd5",
  measurementId: "G-RB5DGWKFHV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();



export {app ,auth};
