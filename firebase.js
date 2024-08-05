// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5sQjAhRcx08KlOvoJ-dC_L0xmtx_-QHs",
  authDomain: "headstarter2-5b153.firebaseapp.com",
  projectId: "headstarter2-5b153",
  storageBucket: "headstarter2-5b153.appspot.com",
  messagingSenderId: "134993030017",
  appId: "1:134993030017:web:9fc6d09ab195c5e4171680",
  measurementId: "G-KYT8K92ZMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }