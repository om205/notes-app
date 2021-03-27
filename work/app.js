makeNoteVisible();

var firebaseConfig = {
    apiKey: "AIzaSyBvzAirkTCeqnsr-5wulIkBq9JB8WiYGVM",
    authDomain: "notes-app-b6d33.firebaseapp.com",
    projectId: "notes-app-b6d33",
    storageBucket: "notes-app-b6d33.appspot.com",
    messagingSenderId: "909957840854",
    appId: "1:909957840854:web:ba077ec048bff459762e77",
    measurementId: "G-8S15PFS07Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();













document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app);

});
const auth = firebase.auth();


// Imported commands


// firebase.auth().signInWithEmailAndPassword(email, password)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//   });



//   firebase.auth().createUserWithEmailAndPassword(email, password)
//   .then((userCredential) => {
//     // Signed in 
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });






firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
       
        takeSignInToHome();
    } else {
        // No user is signed in.
       
        takeSignUpToHome();

    }
});













function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log(user);
            takeSignInToHome();
        })
}



function loginEmail() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    // window.alert(email+" "+password);
    const prom = firebase.auth().signInWithEmailAndPassword(email, password)
    prom.then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        
        // ...
    });
    prom.catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode+" "+errorMessage);
    });
    takeSignInToHome();
    
}

        () => {
            var email = document.getElementById("newEmail").value;
            var password = document.getElementById("newPassword").value;
            // window.alert(email+" "+password);
            const promise = firebase.auth().createUserWithEmailAndPassword(email, password);
            promise.then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // ...
                console.log("signed up");
            });
            promise.catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
                console.log(errorCode + errorMessage);
            });
            takeSignUpToHome();
            
        }


function login() {
    document.getElementById("preLoginPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "none";


}

function createId() {
    document.getElementById("preLoginPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signUpPage").style.display = "block";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "none";

}




function deleteNote(index) {

    var notes = localStorage.getItem("notes");
    var titles = localStorage.getItem("titles");
    if (notes == null) {
        notesObj = [];
        titlesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
        titlesObj = JSON.parse(titles);
    }
    notesObj.splice(index,1);
    titlesObj.splice(index,1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    localStorage.setItem("titles", JSON.stringify(titlesObj));
    makeNoteVisible();
}


function makeNoteVisible() {
    
    var notes = localStorage.getItem("notes");
    var titles = localStorage.getItem("titles");
    if (notes == null) {
        notesObj = [];
        titlesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
        titlesObj = JSON.parse(titles);
    }
    var a = "";
    for (var i = 0; i < notesObj.length; i++) {
        a += `
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${titlesObj[i]}</h5>
                <p class="card-text">${notesObj[i]}</p>
                <button type="button" onclick="takeNote()" class="btn btn-outline-primary">edit</a>
                <button id="${i}" type="button" onclick="deleteNote(this.id)" class="btn btn-warning">delete</button>
            </div>
        </div>
        `
    }
    var notesElem = document.getElementById('noteSpace');
    if (notesObj.length != 0) {
        notesElem.innerHTML = a;
    }
    else {
        notesElem.innerHTML = `No notes added yet please click "Add Notes" above to add notes.`;
    }
}




var index;
function takeNote() {
    document.getElementById("preLoginPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "block";
}

function saveNote() {
    var noteTitle = document.getElementById("TitleOfNote");
    var note = document.getElementById("NoteText");
    // 
    var notes = localStorage.getItem("notes");
    var titles = localStorage.getItem("titles");
    if (notes == null) {
        notesObj = [];
        titlesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
        titlesObj = JSON.parse(titles);
    }
    notesObj.push(note.value);
    titlesObj.push(noteTitle.value);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    localStorage.setItem("titles", JSON.stringify(titlesObj));
    console.log("not fine");
    note.value = "";
    noteTitle.value = "";


    makeNoteVisible();
    takeNoteToHome();

    









}
function takeNoteToHome() {
    document.getElementById("homePage").style.display = "block";
    document.getElementById("noteTakingPage").style.display = "none";
}
function takeSignUpToHome() {
    document.getElementById("homePage").style.display = "block";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("preLoginPage").style.display = "none";

}
function takeSignInToHome() {
    document.getElementById("homePage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("preLoginPage").style.display = "none";
}
function takePreLoginToSignIn() {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("preLoginPage").style.display = "none";
}
function takePreLoginToSignUp() {
    document.getElementById("signUpPage").style.display = "block";
    document.getElementById("preLoginPage").style.display = "none";
}
