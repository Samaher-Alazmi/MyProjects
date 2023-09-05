// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc, getDocs,setDoc,doc,updateDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged,setPersistence,browserSessionPersistence} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx4MrJq9hfW165vvCK4wyHjywSJcR1zjc",
  authDomain: "pds-uav-e76bb.firebaseapp.com",
  projectId: "pds-uav-e76bb",
  storageBucket: "pds-uav-e76bb.appspot.com",
  messagingSenderId: "482759149854",
  appId: "1:482759149854:web:0797f3a2ffecc6106ee10f",
  measurementId: "G-24LDSH8HWB"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const submitButton = document.getElementById("signIn");
const  emailInput = document.getElementById("floatingInput");
const  passwordInput = document.getElementById("floatingPassword");
const LogOut = document.querySelector(".Log-out");

var email, password;
submitButton.addEventListener("click", e=> {
  e.preventDefault()
  email = emailInput.value;
  password = passwordInput.value;

signInWithEmailAndPassword(auth, email, password)
.then(async (userCredential) => {
  // Signed in
  const user = userCredential.user;
  const d = new Date();
  let text = d.toString();
  try {
    const RMDE_Ref = doc(db, "RMD-E", user.uid);
    await updateDoc(RMDE_Ref, {
      lastLoginTime:text
    });
    window.location.href = '/home/'
    console.log("Document written with ID: ");
}catch (e) {
  console.error("Error adding document: ", e);
}
  window.alert("Welcome back");
}).catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log("Error occurred. Try again.");
  window.alert(" Try again."+errorMessage);
});
});

onAuthStateChanged(auth,  (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
    
 
  } else {
    // User is signed out
    // ...
  }
});