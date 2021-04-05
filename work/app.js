// update:
// mark for important not working
























// making reference to firebase authentication and firebase firestore
const auth = firebase.auth();
const db = firebase.firestore();





// seeting up UI according to user logged in or logged out state
let loggedout = document.querySelectorAll(`.logoutState`);
let loggedin = document.querySelectorAll(`.loginState`);
let userDetails = document.querySelector('.modal-body');

const setupUI = (user) => {
    if (user != null) {
        // get account information
        db.collection('users').doc(user.uid).get().then(doc => {

            const html =
                `
            <div>Username:  ${doc.data().username}
            <br>Email:  ${user.email}</div>
            `;
            userDetails.innerHTML = html;
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
        userDetails.innerHTML = '';
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
    if (data.note == undefined) {
        // console.log('logged out');
    }
    else {

        for (let index = 0; index < data.note.length; index++) {
            const note = data;
            // console.log(note);
            html += `
        <div class="card" style="width: 18rem;border-radius:10%;border-color:black;border-width:2px;background-color:lightyellow">
        <div class="card-body">
            
            
            <h2 class="card-title">${note.title[index]}</h2>
            <p class="card-text">${note.note[index]}</p>
            <div>
            <br>
            <div class="blockquote-footer" >
            ${note.time[index]}
             </div>
             <button id="x${index}" type="button" onclick="editNote(this.id)" class="btn btn-outline-secondary">Edit note</button>

             <button id="${index}" type="button" onclick="deleteNote(this.id)" class="btn btn-outline-danger">Remove note</button>
             
             </div>
             <div style="text-align:right">
             <span class="star-rating">   
                
            <input class="important"  type="checkbox" id="y${index}" onclick="markImp(this.id)" name="rating" > mark as important</span></div>
        </div>
    </div> <br>
        `;

        }
        // window.alert(data.star[0]);

        var notesElem = document.getElementById('noteSpace');
        if (data.note.length != 0) {
            notesElem.innerHTML = html;
        }
        else {
            notesElem.innerHTML = `No notes added yet please click "Add Notes" above to add notes.`;
        }
        checkNotes();

    }
}


// var checkbox=document.querySelectorAll(".important");
// document.addEventListener('change', function() {
//     var user = firebase.auth().currentUser;
    
//     if (this.checked) {
//         var check=true;
//     } else {
//         var check =false;
//     }

// })





function checkNotes() {
    var user = firebase.auth().currentUser;
    
    db.collection('users').doc(user.uid).get().then(doc => {
        starObj=doc.data().star;
        for(i=0;i<doc.data().star.length;i++){
            let check=document.getElementById('y'+i);
            check.checked=starObj[i];
            // window.alert(check)
        };

    })
}




function markImp(s) {
    var cb=document.getElementById(s);
    s=s.substring(1);
    var index=parseInt(s);
    var user = firebase.auth().currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
        starObj =doc.data().star;
        // window.alert(cb.checked)
        starObj[index]=cb.checked;
    db.collection('users').doc(user.uid).update({
        star: starObj
    })
})

}




function saveNote() {


    var user = firebase.auth().currentUser;

    var noteTitle = document.getElementById("TitleOfNote");
    var note = document.getElementById("NoteText");
    var t = new Date();
    // window.alert(t.getDate())
    var d = JSON.stringify(t.getDate());
    var m = JSON.stringify(t.getMonth());
    var y = JSON.stringify(t.getFullYear());
    var h = JSON.stringify(t.getHours());
    var min = JSON.stringify(t.getMinutes());
    // to display minute in two digits
    if(min.length==1) {
        min='0'.concat(min);
    }
    var time = 'created on '+d + '-' + m + '-' + y + ' at ' + h + ':' + min;

    db.collection('users').doc(user.uid).get().then(doc => {

        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj =doc.data().star;

        notesObj.push(note.value);
        titlesObj.push(noteTitle.value);
        timeObj.push(time);
        starObj.push(false);


        db.collection('users').doc(user.uid).update({

            note: notesObj,
            title: titlesObj,
            time: timeObj,
            star: starObj
        })
            .then(() => {
                note.value = '';
                noteTitle.value = '';
                toHome();
            }).catch(err => {
                window.alert(err.message);
            });
    });



}


function deleteNote(index) {
    var user = firebase.auth().currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {

        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj = doc.data().star;

        notesObj.splice(index, 1);
        titlesObj.splice(index, 1);
        timeObj.splice(index, 1);
        starObj.splice(index,1);


        db.collection('users').doc(user.uid).update({

            note: notesObj,
            title: titlesObj,
            time: timeObj,
            star: starObj
        })

    });
}


// editing note functionality
function editNote(s) {
    s=s.substring(1);
    var index=parseInt(s);
    var user = firebase.auth().currentUser;
    var title=document.getElementById('TitleOfNote');
    var note=document.getElementById('NoteText');
    var updateBtn=document.getElementById('UpdateBtn');
    var saveBtn=document.getElementById('SaveBtn');
    db.collection('users').doc(user.uid).get().then(doc => {

        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj = doc.data().star;
        toNoteTakingPage();
        updateBtn.style.display='block';
        saveBtn.style.display='none';
        title.value=titlesObj[index];
        note.value=notesObj[index];
        updateBtn.addEventListener('click',(e) => {
            e.preventDefault();
           notesObj[index]=note.value;
           titlesObj[index]=title.value;
           var t = new Date();
            // window.alert(t.getDate())
            var d = JSON.stringify(t.getDate());
            var m = JSON.stringify(t.getMonth());
            var y = JSON.stringify(t.getFullYear());
            var h = JSON.stringify(t.getHours());
            var min = JSON.stringify(t.getMinutes());
            // to display minute in two digits
            if(min.length==1) {
            min='0'.concat(min);
            }
            var date = d + '-' + m + '-' + y + ' at ' + h + ':' + min;
           
           timeObj[index]=timeObj[index].concat(`\nupdated on ${date}`);
           db.collection('users').doc(user.uid).update({

            note: notesObj,
            title: titlesObj,
            time: timeObj,
            star: starObj
        })
            .then(() => {
                note.value = '';
                title.value = '';
                updateBtn.style.display='none';
                saveBtn.style.display='block';
                toHome();
            })
            .catch(err => {
                window.alert(err.message);
                
            });
        
        })

    })
}









// check wether user logged in or not
auth.onAuthStateChanged(user => {
    if (user) {

        console.log('user logged in:');
        // Bug to be removed:here if I do not log out user after sign in and call setupUI then error occours that username is undefined. Temporary solution is implemented that make user log out and make them relogin again
        setupUI(user);

        db.collection('users').doc(user.uid).onSnapshot(snapshot => {
            setupNotes(snapshot.data());
        })
    }
    else {
        console.log('user logged out');
        setupUI();
        setupNotes([]);
    }
})




// Below function is a feature to be implemented in further updates of app

//          function googleLogin() {
//              const provider = new firebase.auth.GoogleAuthProvider();

//                 auth.signInWithPopup(provider)
//                     .then(result => {
//             const user = result.user;
//                         console.log(user);
//                         toSignIn();
//                  })
//           }



//signing up user
const signUpForm = document.querySelector('#signUp-Form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUpForm['newEmail'].value;
    const password = signUpForm['newPassword'].value;
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        
        return db.collection('users').doc(cred.user.uid).set({
            username: signUpForm['username'].value,
            note: [],
            title: [],
            time: [], 
            star: []
        }).then(() => {
            signUpForm['newEmail'].value ='';
            signUpForm['newPassword'].value ='';
            signUpForm['username'].value ='';
            auth.signOut().then(() => {
                toSignIn();

            });

        });


    })
    
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorCode+'\n'+errorMessage);
       
      });
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
            loginForm['email'].value = '';
            loginForm['password'].value = '';
            toHome();
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorCode+'\n'+errorMessage);
          });

});


var searchOptions=1;
document.querySelector('#option1').addEventListener('click',(e)=> {
    e.preventDefault();
    searchOptions=1;
});
document.querySelector('#option2').addEventListener('click',(e)=> {
    e.preventDefault();
    searchOptions=2;
});
document.querySelector('#option3').addEventListener('click',(e)=> {
    e.preventDefault();
    Array.from(document.getElementsByClassName('card')).forEach(function(element) {
    var c=element.getElementsByTagName('input')[0].checked;
    if(c==false) {
                element.style.display='none';
            } else {
                element.style.display='block';
            }
        })
});



var search= document.getElementById('searchText');
search.addEventListener(`input`,function() {
    var input=search.value.toLowerCase();
    let noteCards=document.getElementsByClassName('card');
    Array.from(noteCards).forEach(function(element){
        
        if(searchOptions==1){
        var cardTxt=element.getElementsByTagName('p')[0].innerText;
        }
        if(searchOptions==2) {
            var cardTxt=element.getElementsByTagName('h2')[0].innerText;
        }
        
        
        if(cardTxt.includes(input)) {
            element.style.display='block';

        }
        else {
            element.style.display='none';
        }
        
    })   
} )






// functions to make several pages visible
function discard() {
    document.getElementById('UpdateBtn').style.display="none";
    document.getElementById('SaveBtn').style.display="block";
    document.getElementById('NoteText').value='';
    document.getElementById('TitleOfNote').value='';
    toHome();
}
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








// further lines of code not related to app.They are based on local storage. They are just for reference.







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
