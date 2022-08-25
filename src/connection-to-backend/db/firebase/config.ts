// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { IMyEnv } from "src/main-interfaces/sweet";

const myEnv = process.env as IMyEnv;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: myEnv.REACT_APP_FIREBASE_API_KEY,
  authDomain: myEnv.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: myEnv.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: myEnv.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: myEnv.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: myEnv.REACT_APP_FIREBASE_APP_ID,
  measurementId: myEnv.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const functions = getFunctions(firebaseApp);

export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

// const firebaseAnalytics = getAnalytics(firebaseApp);

// ==========================
// ==========================
// ==========================
// ==========================

/*

// import { backup } from "firestore-export-import";

backups().then((collections) => {
// ['collectionName1', 'collectionName2'] // Array of collection's name is OPTIONAL
  // You can do whatever you want with collections
  console.log(JSON.stringify(collections));
});

backup("users").then((data) => {
  const json = JSON.stringify(data);
  console.log(json);

  //where collection.json is your output file name.
  // fs.writeFile("collection.json", json, "utf8", () => {
  //   console.log("done");
  // });
});
*/
