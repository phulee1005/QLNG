// firebaseInit.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB_4nBRLLYyxYs_FPVJQ7yeiaVseld575U",
    authDomain: "usersmanager-6f182.firebaseapp.com",
    projectId: "usersmanager-6f182",
    storageBucket: "usersmanager-6f182.appspot.com",
    messagingSenderId: "479088302483",
    appId: "1:479088302483:web:c2d29d42c09253b260b066"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
  