import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc, getDocs,doc,setDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const signupPasswordIn = document.getElementById("Password");
const signupEmailIn = document.getElementById("email");
const PhoneNumber = document.getElementById("PhoneNumber");
const createacctbtn = document.getElementById("submit");

function validation(){
  let nameregex = /^[a-zA-z]+$/;
  let emailregex = /^[a-zA-Z0-9\.]+@(gmail|yahoo|outlook|hotmail)\.com$/;
  let passregex = /^[a-zA-z0-9]{6,}$/;
  let phoneregex = /^[0-9]{9,}$/;
  if(!nameregex.test(firstName.value)){
    alert("First name should only contain alphabets");
    return false;
  }
  if(!nameregex.test(lastName.value)){
    alert("Last name should only contain alphabets");
    return false;
  }
  if(!emailregex.test(signupEmailIn.value)){
    alert("Ivalid Email");
    return false;
  }
   if(!passregex.test(signupPasswordIn.value)){
    alert("Password must be at least 6 characters \n~ Password can be alphanumeric");
    return false;
  }
   if(!phoneregex.test(PhoneNumber.value)){
    alert("Phone number must be 9 numbers");
    return false;
  }
  return true;
}
function RegisterUser(){
  if(!validation()){
    return;
  };
return true;
}
createacctbtn.addEventListener("click", e=> {
 if(RegisterUser()){
 e.preventDefault();
    createUserWithEmailAndPassword(auth, signupEmailIn.value, signupPasswordIn.value)
      .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
          try {
      const RMDE_Ref = await setDoc(doc(db, "RMD-E", user.uid), {
      first_Name: firstName.value,
      last_Name: lastName.value,
      Email:signupEmailIn.value,
      Phone_Number: PhoneNumber.value,
});
window.location.href = '/home/'
console.log("Document written with ID: ");
}catch (e) {
  console.error("Error adding document: ", e);
}
      window.alert("Success! Account created.");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert("Error occurred. Try again."+errorCode);
    });
 }
});
