// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCypBPl0u810r8VMQMSQctShVf5AKI8oFk",
  authDomain: "next-ecommerce-404013.firebaseapp.com",
  projectId: "next-ecommerce-404013",
  storageBucket: "next-ecommerce-404013.appspot.com",
  messagingSenderId: "198739329550",
  appId: "1:198739329550:web:8510c973e073878b43325f",
  measurementId: "G-177XL2HVFJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
