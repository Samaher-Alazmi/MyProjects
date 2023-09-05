//const LogOut = document.querySelector(".Log-out");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc, getDocs,setDoc,getDoc, doc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, "UploadPothole"), where("Status", "==", "Repaired"));
var counter1 = 0;
const querySnapsho = await getDocs(q);
querySnapsho.forEach((doc) => {
  counter1 = counter1 + 1;
  //console.log(doc.id, " => ", doc.data());
 // console.log(counter1);
});

const p = query(collection(db, "UploadPothole"), where("Status", "==", "Under Progress"));
var counter2 = 0;
const querySnapsh = await getDocs(p);
querySnapsh.forEach((doc) => {
  counter2 = counter2 + 1;
  //console.log(doc.id, " => ", doc.data());
  //console.log(counter2);
});

const j = query(collection(db, "UploadPothole"), where("Status", "==", "Waiting for repairment"));
var counter3 = 0;
const querySnaps = await getDocs(j);
querySnaps.forEach((doc) => {
  counter3 = counter3 + 1;
  //console.log(doc.id, " => ", doc.data());
 // console.log(counter3);
});

localStorage.setItem("c1", counter1);
localStorage.setItem("c2", counter2);
localStorage.setItem("c3", counter3);
