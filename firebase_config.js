import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

// import { getDatabase } from "firebase/database";
// import { initializeApp } from "firebase/app";

const firebaseConfig =  firebase.initializeApp({
    apiKey: "AIzaSyC1Sf19DGYTB-p8ILjVYQDb4qe21WFOgTU",
    authDomain: "car-rental-522c3.firebaseapp.com",
    projectId:  "car-rental-522c3",
    storageBucket: "car-rental-522c3.appspot.com",
    messagingSenderId: "407772076461",
    appId: "1:407772076461:web:012768eb1777377685e924"
});

export const storage = getStorage();
export const db = firebase.firestore(firebaseConfig);
export const auth = getAuth(firebaseConfig);
export default firebaseConfig;
// const app = initializeApp(firebaseConfig);
//export const db = getDatabase(app);

