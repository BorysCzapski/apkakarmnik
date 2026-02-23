// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWr1kL1fSJctdIKRW6FdmL4Ur1YtL1yMc",
  authDomain: "koci-karmnik.firebaseapp.com",
  projectId: "koci-karmnik",
  storageBucket: "koci-karmnik.firebasestorage.app",
  messagingSenderId: "37610233722",
  appId: "1:37610233722:web:fdc19210c84b19d01ec0c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);s