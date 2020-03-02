const Users = Parse.Object.extend('Users');
const myNewObject = new Users();
const query = new Parse.Query(Users);

let element = document.getElementById("bad-password");


$('.form-signup').on('submit', function (e) {

    var currentUser = Parse.User.current();
    if (currentUser) {
        // do stuff with the user
        Parse.User.logOut();
    }

    e.preventDefault();
    var user = new Parse.User();

    var username = $('#name').val();
    var password = $('#password').val();
    var email = $('#email').val();

    console.log(name, password, email);

    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    user.signUp().then((user) => {
        // if (typeof document !== 'undefined') document.write(`User signed up: ${JSON.stringify(user)}`);
        Parse.User.logOut();
        console.log('User signed up', user);
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if(page == "registration-sk.html") window.open('login-sk.html','_blank');
        else window.open('login.html', '_blank');
    }).catch(error => {
        element.innerHTML = (`${JSON.stringify(error.message)}`.slice(1,-1));
    });

});

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

//
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", onBackKeyDown, false);
}

// Handle the back button
//
function onBackKeyDown() {
    window.location.href = "index.html";
}
