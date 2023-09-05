
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc, getDocs,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getStorage , ref ,uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js"

// PDS-UAV web app's Firebase configuration
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
const storage = getStorage(app);

const addBtn = document.getElementById("submit");
const Longitude = document.getElementById("Longitude");
const Latitude = document.getElementById("Latitude");
const District = document.getElementById("District");


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
         console.log(imgDetails.type)
        document.querySelector(".img-size").innerText = imgDetails.size + "bytes";
        previewImage(imgDetails);
        uploadImage(imageToUpload,imgName,imgDetails);
    } else {
        imagePreview.src = ""
        errorMessage.innerText = "Please select a picture";
        console.error("Please select a picture");
        window.alert("Please select a picture");
        info.style.display = "none";
    }

})

function uploadImage(imageToUpload,imgName,imgDetails){
  const metadata = {
    contentType: imageToUpload };
  // Upload file and metadata to the object 'images/imgName.jpg'
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
      }}, 
    (error) => {
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;

      } }, 
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
          console.log(imgD);
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
//-----------end---------------------------


const CancelBtn = document.getElementById("cancel");
CancelBtn.onclick = function(){
  window.location.href = '/home/'
}
 



addBtn.addEventListener("click", async e => {
  if(RegisterUser()){
    e.preventDefault();
    const d = new Date();
    let text = d.toString();
    try {
    const docRef = await addDoc(collection(db, "UploadPothole"), {
        Longitude: Longitude.value,
        Latitude: Latitude.value,
        District: District.value,
        image: imgName,
        ImageURL: url,
        Status: "Waiting for repairment",
        timestamp: text
    });
    window.location.href = '/home/'
    window.alert("Pothole has been uploaded");
      }catch (e) {
           console.error("Error adding document: ", e);
           window.alert("Error adding document:", e);
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