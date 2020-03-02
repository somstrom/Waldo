var storage = window.localStorage;

$('.form-login').on('submit', function (e) {

    let element = document.getElementById("bad-password");

    e.preventDefault();

    var username = $('#name').val();
    var password = $('#password').val();


    if (document.getElementById('login-check').checked) {
        storage.setItem(username, password);
    }

    console.log(username, password);

    // Pass the username and password to logIn function
    Parse.User.logIn(username, password).then((user) => {
        // Do stuff after successful login
        // if (typeof document !== 'undefined') document.write(`Logged in user: ${JSON.stringify(user)}`);
        // console.log("actual window: "+window.location.href);
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if(page == "login-sk.html") window.open('index-sk.html','_blank');
        else window.open('index.html', '_blank');
        console.log('Logged in user', user);
    }).catch(error => {
        element.innerHTML = (`${JSON.stringify(error.message)}`.slice(1, -1));
    })

});

document.getElementById('name').addEventListener('input', function (e) {
    var pw = storage.getItem(this.value);
    if (pw != null) {
        document.getElementById('password').value = pw
    }
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





