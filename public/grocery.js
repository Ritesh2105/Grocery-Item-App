import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("Books/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#groceryList").html("");
        for(let n = 0; n < aKeys.length; n++){
            const sKey=aKeys[n]
            let sCard = `
            <div style="width: 700px;">
                <div style="float: left; width: 200px;" class="card">`;
              
              if(oItems[aKeys[n]].datePurchased != null)
              {
                sCard += 
                  ` <div class="card-content card-content-padding" style="text-decoration: line-through;">Title: ${oItems[aKeys[n]].title}</div>`;
              }
              else
              {
                sCard += 
                  ` <div class="card-content card-content-padding">Title: ${oItems[aKeys[n]].title}</div>`;
              }
              sCard += 
              ` <div>
                    <div class="card-content card-content-padding">Author: ${oItems[aKeys[n]].author}</div>
                    <div class="card-content card-content-padding">Genre: ${oItems[aKeys[n]].genre}</div>
                    <div class="card-content card-content-padding">Published: ${oItems[aKeys[n]].published}</div>
                    <button id=d${sKey} class="delete" style="padding:10px;">I don't need this</button>
                    </br>
                    <button id=f${sKey} class="finish" style="padding:10px;">I bought this</button>
                </div> 
                </div>
            </div>
            `
            $$("#groceryList").append(sCard);
        }
        createDeleteHandlers(); 
        createFinishHandlers();
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("Books/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});
function createDeleteHandlers(){
    var aClassname=document.getElementsByClassName("delete");
    const sUser = firebase.auth().currentUser.uid;
    for(var n=0; n<aClassname.length;n++){
        aClassname[n].addEventListener("click", (evt) =>{
            const sId = evt.target.id.substr(1);
            console.log(sId);
            firebase.database().ref("Books/"+ sUser+"/"+sId).remove();
        })
    }
}

function createFinishHandlers(){
    var aClassname = document.getElementsByClassName("finish");
    const sUser = firebase.auth().currentUser.uid;
    for(var n = 0; n < aClassname.length; n++){
      aClassname[n].addEventListener("click", (evt) =>{
        const sId = evt.target.id.substr(1);
        const sFinished =  new Date().toISOString().replace(".", "_");
        firebase.database().ref("Books/" + sUser + "/" + sId + "/datePurchased").set(sFinished);
      })
    }
  }