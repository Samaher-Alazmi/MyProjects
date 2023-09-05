//const LogOut = document.querySelector(".Log-out");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore , collection, addDoc, getDocs,setDoc,getDoc, doc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

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







  const querySnapshot = await getDocs(collection(db, "UploadPothole"));
  querySnapshot.forEach((doc) => {
    
    var pi = doc.id;
    var at = doc.data().Latitude;
    var ng = doc.data().Longitude;
    var dis = doc.data().District;
    var st = doc.data().Status;
    var time = doc.data().timestamp;
    var image = doc.data().ImageURL;
    console.log(time);
    var marker = new google.maps.Marker({
      position: {lat: Number(at), lng: Number(ng)},
      map: map,
      url: '/update/'
  });

  marker.addListener("click", () => {
    console.log(marker);
    localStorage.setItem("Lat", at);
    localStorage.setItem("Lon", ng);
    localStorage.setItem("Dis", dis);
    localStorage.setItem("id", pi);
    localStorage.setItem("sta", st);
   localStorage.setItem("tim", time);
   localStorage.setItem("imag", image);
        window.open(marker.url);
      });

});








//Table
var tbody = document.getElementById("tbody1");
var PotholeList =[];

function AddItemToTable(pothileId,pID, Status,District,timestamp,Latitude,Longitude,ImageURL){
  let trow = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");

  PotholeList.push([pID,Status,District,timestamp,Latitude,Longitude,ImageURL]);

  td1.innerHTML= pothileId;
  td2.innerHTML= Status;
  td3.innerHTML= District;
  td4.innerHTML= timestamp;

  td2.classList += "statField";
  td3.classList += "disField";
  td4.classList += "modiField";

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);

   var EditDiv = document.createElement("div");
  EditDiv.innerHTML ='<button class="btn  my-2 ml-2 t-op-nextlvl label-tag" onclick="Update('+pothileId+')">  Edit </button>'
  trow.appendChild(EditDiv);
  tbody.appendChild(trow);
}




function AddAllItemToTable(ThePothole ,pID,j){
  tbody.innerHTML="";
  j =1;
  var i =0;
  ThePothole.forEach(element => {
    AddItemToTable(j,pID[i],element.Status, element.District ,element.timestamp,element.Latitude,element.Longitude,element.ImageURL);
    i++;
    j++;
  });
}
var pID;
// Get All data 
async function GetAllDataOnce(){
  const querySnapshot = await getDocs(collection(db,"UploadPothole"));
  var Pothole = [];
   pID=[];
  querySnapshot.forEach((doc) => {
    Pothole.push(doc.data());
    pID.push(doc.id);
  });

  AddAllItemToTable(Pothole,pID);
}

 GetAllDataOnce();

async function GetData2(){
  const j = query(collection(db, "UploadPothole"), where("Status", "==", "Waiting for repairment"));
  const querySnapshot = await getDocs(j);
    var Pothole = [];
    pID=[];
  querySnapshot.forEach((doc) => {

    Pothole.push(doc.data());
    pID.push(doc.id);
    console.log(Pothole);
  });

  AddAllItemToTable(Pothole,pID);

}


async function GetData3(){
  const j = query(collection(db, "UploadPothole"), where("Status", "==", "Under Progress"));
  const querySnapshot = await getDocs(j);
    var Pothole = [];
    pID=[];
  querySnapshot.forEach((doc) => {

    Pothole.push(doc.data());
    pID.push(doc.id);
    console.log(Pothole);
  });
 

  AddAllItemToTable(Pothole,pID);

}

async function GetData4(){
  const j = query(collection(db, "UploadPothole"), where("Status", "==", "Repaired"));
  const querySnapshot = await getDocs(j);
    var Pothole = [];
    pID=[];
  querySnapshot.forEach((doc) => {

    Pothole.push(doc.data());
    pID.push(doc.id);
    console.log(Pothole);
  });
 

  AddAllItemToTable(Pothole,pID);

}

window.Update=(index)=>{
  console.log(index);
    --index;
    var p = PotholeList[index][0];
    var s = PotholeList[index][1];
    var d = PotholeList[index][2];
    var t = PotholeList[index][3];
    var laat = PotholeList[index][4];
    var long = PotholeList[index][5];
    var mp = PotholeList[index][6];
    localStorage.setItem("id", p);
    localStorage.setItem("Lat", laat);
    localStorage.setItem("Lon", long);
    localStorage.setItem("Dis", d);
    localStorage.setItem("sta", s);
   localStorage.setItem("tim", t);
   localStorage.setItem("imag",mp);
    console.log(p);
   window.location.href = '/update/'
  }


//search function
var searchBar = document.getElementById("SearchBar");
var searchBtn = document.getElementById("searchBtn");
var Category = document.getElementById("CategorySelected");
var stat1 = document.getElementById("statuses");

function SearchTable(Category){
  var filter = searchBar.value.toLocaleUpperCase();
  var tr = tbody.getElementsByTagName("tr");
  var found ;
  for (let i = 0; i < tr.length; i++) {
    var td = tr[i].getElementsByClassName(Category);
    for (let j = 0; j < td.length; j++) {
      if(td[j].innerHTML.toLocaleUpperCase().indexOf(filter) > -1){
        found = true;
      }
    }
    if(found){
      tr[i].style.display = "";
      found = false;
    }
    else {
      tr[i].style.display = "none";
    }
  }
}
searchBtn.onclick = function(){
  if(searchBar.value==""){
    GetAllDataOnce();
  }
  else if(Category.value==1){
    SearchTable("statField");
  }
  else if(Category.value==2){
    SearchTable("disField");
  }
  else if(Category.value==3){
    SearchTable("modiField");
  }
  if(stat1.value == 0 && searchBar.value==""){
    GetAllDataOnce();
  }
else if(stat1.value == 1 && searchBar.value==""){
  GetData2();
}
else if(stat1.value == 2 && searchBar.value==""){
  GetData3();
}
else if(stat1.value == 3 && searchBar.value==""){
  GetData4();
}

}
