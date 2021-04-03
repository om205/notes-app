const auth = firebase.auth();
const db = firebase.firestore();
// makeNoteVisible();












let loggedout = document.querySelectorAll(`.logoutState`);
let loggedin = document.querySelectorAll(`.loginState`);
let userDetails =document.querySelector('.modal-body');

const setupUI = (user) => {
    if (user != null) {
        // get account information
        db.collection('users').doc(user.uid).get().then(doc => {
           
            const html=
            `
            <div>Username:  ${doc.data().username}
            <br>Email:  ${user.email}</div>
            `;
            userDetails.innerHTML =html;
        })
        
        
        // traverse through array 
        Array.from(loggedin).forEach(element => {
            element.style.display = 'block';
        });
        Array.from(loggedout).forEach(element => {
            element.style.display = 'none';
        });
    }
    else {
        // hide account information
        userDetails.innerHTML='';
        Array.from(loggedin).forEach(element => {
            element.style.display = 'none';
        });
        Array.from(loggedout).forEach(element => {
            element.style.display = 'block';
        });

    }
}










// document.addEventListener("DOMContentLoaded", event => {
//     const app = firebase.app();
//     console.log(app);

// });






const setupNotes = (data) => {
    let html = '';
    if (data.note ==undefined) {
        // console.log('logged out');
    }
    else {
    
    for (let index = 0; index <data.note.length; index++) {
        const note = data;
        // console.log(note);
        html += `
        <div class="card" style="width: 18rem;border-color:black;border-width:2px;">
        <div class="card-body">
            <h5 class="card-title">${note.title[index]}</h5>
            <p class="card-text">${note.note[index]}</p>
            <div>
            <button id="${index}" type="button" onclick="deleteNote(this.id)" class="btn btn-outline-danger">Remove note</button></div><br>
            <div class="blockquote-footer" >
            created on ${note.time}
             </div>
        </div>
    </div>
        `;

    }

    var notesElem = document.getElementById('noteSpace');
    if (data.length != 0) {
        notesElem.innerHTML = html;
    }
    else {
        notesElem.innerHTML = `No notes added yet please click "Add Notes" above to add notes.`;
    }

    }
}

function saveNote() {
    
    
    var user = firebase.auth().currentUser;
    
    var noteTitle = document.getElementById("TitleOfNote");
    var note = document.getElementById("NoteText");
    var t=new Date();
    // window.alert(t.getDate())
    var d=JSON.stringify(t.getDate());
    var m=JSON.stringify(t.getMonth());
    var y=JSON.stringify(t.getFullYear());
    var h=JSON.stringify(t.getHours());
    var min=JSON.stringify(t.getMinutes());
    var time=d+'-'+m+'-'+y+' at '+h+':'+min;
    
    db.collection('users').doc(user.uid).get().then(doc => {
        
        
        
    // if (doc.data().note.length == 0) {
    //     notesObj = [];
    //     titlesObj = [];
    // }
    // else {
        notesObj=doc.data().note;
        titlesObj=doc.data().title;
        timeObj=doc.data().time;
    // }
    notesObj.push(note.value);
        titlesObj.push(noteTitle.value);
        timeObj.push(time);
    
    
    db.collection('users').doc(user.uid).update({
        
        note: notesObj,
        title: titlesObj,
        time: timeObj
    })
    .then(() => {
        note.value='';
        noteTitle.value='';
        toHome();
    }).catch(err => {
        console.log(err.message);
    });
});

 

}


function deleteNote(index) {
    var user = firebase.auth().currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
    
            notesObj=doc.data().note;
            titlesObj=doc.data().title;
            timeObj=doc.data().time;
        
        notesObj.splice(index,1);
        titlesObj.splice(index,1);
        timeObj.splice(index,1);
        
        
        db.collection('users').doc(user.uid).update({
            
            note: notesObj,
            title: titlesObj,
            time: timeObj
        })
        
    });
}
// function deleteNote(index) {

//     var notes = localStorage.getItem("notes");
//     var titles = localStorage.getItem("titles");
//     if (notes == null) {
//         notesObj = [];
//         titlesObj = [];
//     }
//     else {
//         notesObj = JSON.parse(notes);
//         titlesObj = JSON.parse(titles);
//     }
//     notesObj.splice(index,1);
//     titlesObj.splice(index,1);
//     localStorage.setItem("notes", JSON.stringify(notesObj));
//     localStorage.setItem("titles", JSON.stringify(titlesObj));
//     makeNoteVisible();
// }







// check wether user logged in or not
auth.onAuthStateChanged(user => {
    if (user) {
        
        console.log('user logged in:');
        // while(db.collection('users').doc(user.uid).username == undefined) {console.log('username undefined')}
        setupUI(user); 
        
        db.collection('users').doc(user.uid).onSnapshot(snapshot => {
            
            // console.log( snapshot.data());
            setupNotes(snapshot.data());
        })
    }
    else {
        console.log('user logged out');
        setupUI();
        setupNotes([]);
    }
})
// console.log('outside user',user)





// function googleLogin() {
//     const provider = new firebase.auth.GoogleAuthProvider();

//     auth.signInWithPopup(provider)
//         .then(result => {
//             const user = result.user;
//             console.log(user);
//             toSignIn();
//         })
// }



//sign-up method
const signUpForm = document.querySelector('#signUp-Form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUpForm['newEmail'].value;
    const password = signUpForm['newPassword'].value;
    // console.log(email + password);
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred);
        return db.collection('users').doc(cred.user.uid).set({
            username: signUpForm['username'].value,
            note: [],
            title:[],
            time: []
        }).then(() =>{
            signUpForm['newEmail'].value = '';
            signUpForm['newPassword'].value = '';
            signUpForm['username'].value= '';
            auth.signOut().then(() => {
                toSignIn();

            });
            
        });
        

    })
});



// logout method
const logout = document.querySelector('#logoutButton');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut()
        .then(() => {
            console.log('user logged out');
        });

});





//sign-in method
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            // console.log(cred.user);
            loginForm['email'].value = '';
            loginForm['password'].value = '';
            toHome();
        });

});





// function saveNote() {
//     var noteTitle = document.getElementById("TitleOfNote");
//     var note = document.getElementById("NoteText");
//     // 
//     var notes = localStorage.getItem("notes");
//     var titles = localStorage.getItem("titles");
//     if (notes == null) {
//         notesObj = [];
//         titlesObj = [];
//     }
//     else {
//         notesObj = JSON.parse(notes);
//         titlesObj = JSON.parse(titles);
//     }
//     notesObj.push(note.value);
//     titlesObj.push(noteTitle.value);
//     localStorage.setItem("notes", JSON.stringify(notesObj));
//     localStorage.setItem("titles", JSON.stringify(titlesObj));
//     console.log("not fine");
//     note.value = "";
//     noteTitle.value = "";


//     makeNoteVisible();
//     toHome();

// }













// () => {
//     var email = document.getElementById("newEmail").value;
//     var password = document.getElementById("newPassword").value;
//     // window.alert(email+" "+password);
//     const promise = firebase.auth().createUserWithEmailAndPassword(email, password);
//     promise.then((userCredential) => {
//         // Signed in 
//         var user = userCredential.user;
//         // ...
//         console.log("signed up");
//     });
//     promise.catch((error) => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ..
//         console.log(errorCode + errorMessage);
//     });
//     toSignUp();

// }


// function loginEmail() {
//     var email = document.getElementById("email").value;
//     var password = document.getElementById("password").value;
//     // window.alert(email+" "+password);
//     const prom = firebase.auth().signInWithEmailAndPassword(email, password)
//     prom.then((userCredential) => {
//         // Signed in
//         var user = userCredential.user;

//         // ...
//     });
//     prom.catch((error) => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log(errorCode+" "+errorMessage);
//     });
//     toSignIn();

// }














// function login() {
//     document.getElementById("preLoginPage").style.display = "none";
//     document.getElementById("loginPage").style.display = "block";
//     document.getElementById("signUpPage").style.display = "none";
//     document.getElementById("homePage").style.display = "none";
//     document.getElementById("noteTakingPage").style.display = "none";


// }

// function createId() {
//     document.getElementById("preLoginPage").style.display = "none";
//     document.getElementById("loginPage").style.display = "none";
//     document.getElementById("signUpPage").style.display = "block";
//     document.getElementById("homePage").style.display = "none";
//     document.getElementById("noteTakingPage").style.display = "none";

// }




// function deleteNote(index) {

//     var notes = localStorage.getItem("notes");
//     var titles = localStorage.getItem("titles");
//     if (notes == null) {
//         notesObj = [];
//         titlesObj = [];
//     }
//     else {
//         notesObj = JSON.parse(notes);
//         titlesObj = JSON.parse(titles);
//     }
//     notesObj.splice(index,1);
//     titlesObj.splice(index,1);
//     localStorage.setItem("notes", JSON.stringify(notesObj));
//     localStorage.setItem("titles", JSON.stringify(titlesObj));
//     makeNoteVisible();
// }


// function makeNoteVisible() {

//     var notes = localStorage.getItem("notes");
//     var titles = localStorage.getItem("titles");
//     if (notes == null) {
//         notesObj = [];
//         titlesObj = [];
//     }
//     else {
//         notesObj = JSON.parse(notes);
//         titlesObj = JSON.parse(titles);
//     }
//     var a = "";
//     for (var i = 0; i < notesObj.length; i++) {
//         a += `
//         <div class="card" style="width: 18rem;">
//             <div class="card-body">
//                 <h5 class="card-title">${titlesObj[i]}</h5>
//                 <p class="card-text">${notesObj[i]}</p>
//                 <button type="button" onclick="takeNote()" class="btn btn-outline-primary">edit</a>
//                 <button id="${i}" type="button" onclick="deleteNote(this.id)" class="btn btn-warning">delete</button>
//             </div>
//         </div>
//         `
//     }
//     var notesElem = document.getElementById('noteSpace');
//     if (notesObj.length != 0) {
//         notesElem.innerHTML = a;
//     }
//     else {
//         notesElem.innerHTML = `No notes added yet please click "Add Notes" above to add notes.`;
//     }
// }




// var index;


















function toHome() {
    document.getElementById("homePage").style.display = "block";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "none";
    document.getElementById("homeButton").style.display = "none";
}
function toSignIn() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("noteTakingPage").style.display = "none";
    document.getElementById("homeButton").style.display = "block";
}
function toSignUp() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("signUpPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "none";
    document.getElementById("homeButton").style.display = "block";
}
function toNoteTakingPage() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("noteTakingPage").style.display = "block";
    document.getElementById("homeButton").style.display = "none";
}
