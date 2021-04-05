
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
            const html = `
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

// Function that makes note visible
const setupNotes = (data) => {
    // creating a sting and appending it
    let html = '';
    if (data.note == undefined) {
        console.log('No notes to display as the user is not logged in');
    }
    else {
        for (let index = 0; index < data.note.length; index++) {
            const note = data;
            html += `
            <div class="card" style="width: 18rem;border-radius:10%;border-color:black;border-width:2px;background-color:lightyellow;margin-bottom:10px">
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
            </div> 
            `;
        }
        let notesElem = document.getElementById('noteSpace');
        if (data.note.length != 0) {
            notesElem.innerHTML = html;
        }
        else {
            notesElem.innerHTML = `No notes added yet please click "Add Notes" above to add notes.`;
        }
        checkNotes();

    }
}

// function to ckeck if a note is marked as important by checking from firebase firestore
function checkNotes() {
    let user = firebase.auth().currentUser;
    // getting user and fetching star field of the user
    db.collection('users').doc(user.uid).get().then(doc => {
        starObj = doc.data().star;
        for (i = 0; i < doc.data().star.length; i++) {
            let check = document.getElementById('y' + i);
            check.checked = starObj[i];
        };

    })
}

// function to save mark for important of every note in firestore
function markImp(s) {
    let cb = document.getElementById(s);
    // index of notes is decoded from the id of checkbox passed
    s = s.substring(1);
    let index = parseInt(s);
    let user = firebase.auth().currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
        starObj = doc.data().star;
        starObj[index] = cb.checked;
        db.collection('users').doc(user.uid).update({
            star: starObj
        })
    })
}

// function to save note
function saveNote() {
    const user = firebase.auth().currentUser;
    let noteTitle = document.getElementById("TitleOfNote");
    let note = document.getElementById("NoteText");
    // fetching time from date object
    let t = new Date();
    let d = JSON.stringify(t.getDate());
    let m = JSON.stringify(t.getMonth());
    let y = JSON.stringify(t.getFullYear());
    let h = JSON.stringify(t.getHours());
    let min = JSON.stringify(t.getMinutes());
    // to display minute in two digits
    if (min.length == 1) {
        min = '0'.concat(min);
    }
    let time = 'created on ' + d + '-' + m + '-' + y + ' at ' + h + ':' + min;
    // getting different fields of user, modifying them and updating them
    db.collection('users').doc(user.uid).get().then(doc => {

        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj = doc.data().star;

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
                // removing text from input fields
                note.value = '';
                noteTitle.value = '';
                toHome();
            }).catch(err => {
                window.alert(err.message);
            });
    });
}

// function to delete note
function deleteNote(index) {
    const user = firebase.auth().currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj = doc.data().star;

        // using splice we remove one element at given index
        notesObj.splice(index, 1);
        titlesObj.splice(index, 1);
        timeObj.splice(index, 1);
        starObj.splice(index, 1);


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
    // decoding index of note from id passed
    s = s.substring(1);
    let index = parseInt(s);
    const user = firebase.auth().currentUser;
    // getting different elements from DOM
    let title = document.getElementById('TitleOfNote');
    let note = document.getElementById('NoteText');
    let updateBtn = document.getElementById('UpdateBtn');
    let saveBtn = document.getElementById('SaveBtn');
    db.collection('users').doc(user.uid).get().then(doc => {

        notesObj = doc.data().note;
        titlesObj = doc.data().title;
        timeObj = doc.data().time;
        starObj = doc.data().star;
        toNoteTakingPage();
        // changing layout of Note taking page
        updateBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        // prefilling the value of previously saved note 
        title.value = titlesObj[index];
        note.value = notesObj[index];
        // listen for update button click and then update the note in the firestore
        updateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // immediately removing update button after click to prevent it from double click
            updateBtn.style.display = 'none';
            notesObj[index] = note.value;
            titlesObj[index] = title.value;

            db.collection('users').doc(user.uid).update({
                note: notesObj,
                title: titlesObj,
                time: timeObj,
                star: starObj
            })
                .then(() => {
                    note.value = '';
                    title.value = '';

                    saveBtn.style.display = 'block';
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
        // setting up homepage layout
        setupUI(user);

        db.collection('users').doc(user.uid).onSnapshot(snapshot => {
            // making notes visible
            setupNotes(snapshot.data());
        })
    }
    else {
        console.log('user logged out');
        setupUI();
        // passing empty array for setup note in case of logged out state
        setupNotes([]);
    }
})




// Below function is a feature to be implemented in further updates of app:

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
    // function to create new account
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // creating empty field for new user to store notes and other stuff
        return db.collection('users').doc(cred.user.uid).set({
            username: signUpForm['username'].value,
            note: [],
            title: [],
            time: [],
            star: []
        }).then(() => {
            signUpForm['newEmail'].value = '';
            signUpForm['newPassword'].value = '';
            signUpForm['username'].value = '';
            auth.signOut().then(() => {
                toSignIn();
            });

        });
    }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        window.alert(errorCode + '\n' + errorMessage);
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
            let errorCode = error.code;
            let errorMessage = error.message;
            window.alert(errorCode + '\n' + errorMessage);
        });

});

// searching note functionality
var searchOptions = 1;
document.querySelector('#option1').addEventListener('click', (e) => {
    e.preventDefault();
    searchOptions = 1;
});
document.querySelector('#option2').addEventListener('click', (e) => {
    e.preventDefault();
    searchOptions = 2;
});
// shwoing important notes
document.querySelector('#option3').addEventListener('click', (e) => {
    e.preventDefault();
    Array.from(document.getElementsByClassName('card')).forEach(function (element) {
        var c = element.getElementsByTagName('input')[0].checked;
        if (c == false) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    })
});



var search = document.getElementById('searchText');
// adding event listener to search input field
search.addEventListener(`input`, function () {
    let input = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName('card');
    Array.from(noteCards).forEach(function (element) {

        if (searchOptions == 1) {
            var cardTxt = element.getElementsByTagName('p')[0].innerText;
        }
        if (searchOptions == 2) {
            var cardTxt = element.getElementsByTagName('h2')[0].innerText;
        }

        if (input.length == 1) {
            if (input == cardTxt.charAt(0) || cardTxt.includes(input)) {
                element.style.display = 'block';
            }
            else {
                element.style.display = 'none';
            }
        } else {
            let a=(input==(cardTxt.substring(0,input.length)).toLowerCase());
            if (cardTxt.includes(input)||a) {
                element.style.display = 'block';

            }
            else {
                element.style.display = 'none';
            }
        }

    })
})






// functions to make several pages visible
function discard() {
    document.getElementById('UpdateBtn').style.display = "none";
    document.getElementById('SaveBtn').style.display = "block";
    document.getElementById('NoteText').value = '';
    document.getElementById('TitleOfNote').value = '';
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



