// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc,getDoc, getDocs,setDoc,serverTimestamp, doc,updateDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getStorage , ref ,uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js"

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
const storage = getStorage(app);


//-------------------image----------------
var imgName,imageToUpload , url = "";

const img = document.getElementById("imgInp");
let info = document.getElementById("info");
let errorMessage = document.getElementById("errorMessage");
const imagePreview = document.getElementById("preview");
img.addEventListener("change", (e) => {
    const imgDetails = document.querySelector("input[type=file]").files[0];
    if (imgDetails) {
        info.style.display = "block";
         imgName =  document.querySelector(".img-name").innerText = imgDetails.name;
         imageToUpload = document.querySelector(".img-type").innerText = imgDetails.type;
        document.querySelector(".img-size").innerText = imgDetails.size + "bytes";
        previewImage(imgDetails);
        uploadImage(imageToUpload,imgName,imgDetails);
    } else {
        imagePreview.src = ""
        errorMessage.innerText = "Please select a picture";
        console.error("Please select a picture");
        info.style.display = "none";
    }

})

function uploadImage(imageToUpload,imgName,imgDetails){
  const metadata = {
    contentType: imageToUpload
  };
  
  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, 'images/' + imgName);
  const uploadTask = uploadBytesResumable(storageRef, imgDetails, metadata);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        url = downloadURL;
      });
    }
  );
}
function previewImage(imgD) {
    const reader = new FileReader();

    // PREVIEW
    reader.addEventListener("load", function () {
        imagePreview.src = reader.result;
    })

    // CHECK IF THERE IS SELECTION 
    if (imgD) {
        // CHECK IF THE FILE IS AN IMAGE
        if (imgD.type === "image/jpeg" || imgD.type == "image/jpg" || imgD.type == "image/gif" || imgD.type == "image/png") {
            errorMessage.innerText = "";

            // CONVERTS FILE TO BASE 64
          reader.readAsDataURL(imgD);
          console.log(imgD.name);
          
        } else {
            errorMessage.innerText = "File type should be an image"
            imagePreview.src = "";
        }
    }
    // IF NO IMAGE
    else {
        imagePreview.src = ""
        errorMessage.innerText = "Please select a picture";
    }
}




imagePreview.src=localStorage.getItem('imag');
var v = localStorage.getItem('imag');
console.log(v);
//-----------end---------------------------

//-------------------
const addBtn = document.getElementById("submit");
const CancelBtn = document.getElementById("cancel");
const Longitude = document.getElementById("Longitude");
const Latitude = document.getElementById("Latitude");
const District = document.getElementById("District");

  console.log(Pid);

  CancelBtn.onclick = function(){
    // location.replace("{{ url_for('home') }}");
    window.location.href = '/home/'
  }
   
  var Pid = localStorage.getItem('id');
addBtn.addEventListener("click", async e => {
  if(RegisterUser()){
  e.preventDefault();
  const d = new Date();
  let text = d.toString();
  try {
    const Update_Ref = doc(db, "UploadPothole", Pid);
    await updateDoc(Update_Ref, {
      Status: country.value,
      timestamp: text,
      image: imgName,
      ImageURL: url,
      Latitude: Latitude.value,
      Longitude: Longitude.value,
      District: District.value,
  });
  window.alert("Successfully updated");
  window.location.href = '/home/'
    }catch (e) {
         console.error("Error adding document: ", e);
         window.alert("Error adding document:");
       }
  }   
});

function validation(){
const latRegex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}/g;
const lngRegex = /^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g;
let Districtregex = /^[a-zA-Z\-\s]+$/;

if(!lngRegex.test(Longitude.value)){
  alert("Please enter a valid Longitude");
  return false;
}

if(!latRegex.test(Latitude.value)){
  alert("Please enter a valid Latitude");
  return false;
}


if(!Districtregex.test(District.value)){
  alert("the District should only contain alphabets");
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
