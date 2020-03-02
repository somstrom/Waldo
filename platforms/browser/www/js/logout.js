const User = Parse.Object.extend('User');
const userQuery = new Parse.Query(User);
const current = Parse.User.current();

if (current) {
    // query.equalTo("user", currentUser.id);
    userQuery.equalTo("objectId",current.id)
    userQuery.find().then((results) => {
        console.log(results);
        document.getElementById('online-user').innerHTML = results[0].get('username');
    }, (error) => {
        console.error('Error while fetching Places', error);
    });
    $("#login").hide();
    $("#logout").show();
} else {
    $("#online-user").html("WALDO");
    $("#login").show();
    $("#logout").hide();
}

$("#logout").click(() => {
    Parse.User.logOut();
    // window.reload();
})

// //hide navbar menu by clicking outside
// /* Anything that gets to the document
//    will hide the dropdown */
//    $(document).click(function(){
//     $("#navbarResponsive").hide();
//   });
  
//   /* Clicks within the dropdown won't make
//      it past the dropdown itself */
//   $("#navbarResponsive").click(function(e){
//     e.stopPropagation();
//   });