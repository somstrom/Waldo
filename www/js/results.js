
const type = new URLSearchParams(window.location.search).get('type');
const distance = new URLSearchParams(window.location.search).get('distance');
var objectData;
var coords;

var Places;
var query;

var a = document.createElement("a");
var ulist = document.getElementById("nav-bar-ul");
var newItem = document.createElement("li");

a.textContent = "Results";
a.setAttribute('href', 'results.html?distance=' + distance + '&type=' + type);
newItem.appendChild(a);
ulist.appendChild(newItem);

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

///////////////////BACK BUTTON///////////////////////
// Wait for device API libraries to load
//
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", onBackKeyDown, false);

    navigator.geolocation.getCurrentPosition(function (position) {

        coords = position.coords.latitude + ',' + position.coords.longitude;

        //data zo srvra
        $.ajax({
            url: 'https://places.demo.api.here.com/places/v1/discover/search',
            type: 'GET',
            data: {
                // at: coords,
                q: type,
                in: coords + ';r=' + distance * 1000,
                app_id: 'D8x0KnPC57PZDnJYjOE1',
                app_code: 'GFk2twUkbiVzJQdEjeh9dw'
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Accept', 'application/json');
            },
            success: function (data) {
                printData(data);
            }
        });
    },
        onError
    );
}

// Handle the back button
//
function onBackKeyDown() {
    window.location.href = "index.html";
}
////////////////////////////////////////////////////////

//current pos
// navigator.geolocation.getCurrentPosition(function (position) {

//     coords = position.coords.latitude + ',' + position.coords.longitude;

//     //data zo srvra
//     $.ajax({
//         url: 'https://places.demo.api.here.com/places/v1/discover/search',
//         type: 'GET',
//         data: {
//             // at: coords,
//             q: type,
//             in: coords + ';r=' + distance * 1000,
//             app_id: 'D8x0KnPC57PZDnJYjOE1',
//             app_code: 'GFk2twUkbiVzJQdEjeh9dw'
//         },
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Accept', 'application/json');
//         },
//         success: function (data) {
//             objectData = data;
//             // console.log(objectData);
//             printData(data);
//             // addContacts(data, coords);
//         }
//     });
// },
//     onError
// );

//vypis insfa o jednotlivych prevadzkach
function printData(data) {
    objectData = data;
    var element = document.getElementById("box-main");
    if (element != null) {
        for (i = 0; i < data.results.items.length; i++) {
            if (parseInt(data.results.items[i].distance, 10) < parseInt(distance, 10) * 1000) {

                $("#result-no-places").hide();

                element.innerHTML +=

                    '<div id="box' + i + '">' +
                    '<p class="title">' + data.results.items[i].title + '</p> <hr />' +
                    '<p class="address">' + data.results.items[i].vicinity + '</p>' +
                    '<p class="distance">' + data.results.items[i].distance + ' m</p>' +
                    '<div id="flex">' +
                    '<a href="map.html?distance=' + distance + '&type=' + type +
                    '&longitude=' + data.results.items[i].position[0] + '&latitude=' + data.results.items[i].position[1] +
                    '&index=' + i + '&title=' + data.results.items[i].title + '">' +
                    '<i class="fas fa-map-marked-alt" style="font-size:48px;color:grey;margin:0.8rem;"></i></a>' +
                    '<i class="fas fa-plus" id="plus' + i + '" onclick="addToFavorite(' + i + ');" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
                    '<i class="fas fa-phone" id="' + i + '" onclick="callMyBaby(this);" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
                    // '<i class="fas fa-address-card" id="web' + i + '" onclick="sendMeToURL(this);" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
                    '</div>' +
                    '<a href="history.html"><p id="favorit' + i + '" class="text-center" style="color:red;">One of your favorite places.</p></a>'
                '</div>';

                $("#favorit" + i).hide();

                Places = Parse.Object.extend('Places');
                query = new Parse.Query(Places);

                hideOrShow(i);

            }

        }

    };

}

function hideOrShow(i) {
    if (Parse.User.current()) {
        query.equalTo("user", Parse.User.current().id);
        query.equalTo("title", objectData.results.items[i].title);
        query.find().then((result) => {
            console.log(result)
            if (result.length != 0) {
                $("#favorit" + i).show();
                $("#plus" + i).hide();
            }
        }, (error) => {
            // if (typeof document !== 'undefined') document.write(`Error while fetching Places: ${JSON.stringify(error)}`);
            console.error('Error while fetching Places', error);
        });
    }else{
        $("#plus" + i).hide();
    }
}

function addToFavorite(i) {

    $("#plus" + i).hide(1000);
    $("#favorit" + i).show("slow");

    const myNewObject = new Places();
    const currentUser = Parse.User.current();


    if (currentUser) {
        myNewObject.set('title', objectData.results.items[i].title);
        myNewObject.set('address', objectData.results.items[i].vicinity);
        myNewObject.set('distance', objectData.results.items[i].distance);
        myNewObject.set('latitude', objectData.results.items[i].position[1]);
        myNewObject.set('longitude', objectData.results.items[i].position[0]);
        myNewObject.set('user', currentUser.id);

        myNewObject.save().then(
            (result) => {
                // if (typeof document !== 'undefined') document.write(`Favorites created: ${JSON.stringify(result)}`);
                console.log('Place created', result);
            },
            (error) => {
                // if (typeof document !== 'undefined') document.write(`Error while creating Favorites: ${JSON.stringify(error)}`);
                console.error('Error while creating Favorites: ', error);
            }
        );
    }

    // query.equalTo("user", Parse.User.current().id);
    // query.find().then((results) => {
    //     // You can use the "get" method to get the value of an attribute
    //     // Ex: response.get("<ATTRIBUTE_NAME>")
    //     // if (typeof document !== 'undefined') document.write(`Places found: ${JSON.stringify(results)}`);
    //     console.log('Places found', results);
    //     query.get(objectData.results.items[i].title)
    //         .then(
    //             (result) => { console.log("already your favorite place!") },
    //             (error) => {
    //                 console.log(error)
    //                 myNewObject.set('title', objectData.results.items[i].title);
    //                 myNewObject.set('address', objectData.results.items[i].vicinity);
    //                 myNewObject.set('distance', objectData.results.items[i].distance);
    //                 myNewObject.set('latitude', objectData.results.items[i].position[1]);
    //                 myNewObject.set('longitude', objectData.results.items[i].position[0]);
    //                 myNewObject.set('user', currentUser.id);

    //                 myNewObject.save().then(
    //                     (result) => {
    //                         // if (typeof document !== 'undefined') document.write(`Favorites created: ${JSON.stringify(result)}`);
    //                         console.log('Place created', result);
    //                     },
    //                     (error) => {
    //                         // if (typeof document !== 'undefined') document.write(`Error while creating Favorites: ${JSON.stringify(error)}`);
    //                         console.error('Error while creating Favorites: ', error);
    //                     }
    //                 );
    //             }
    //         );
    // }, (error) => {
    //     // if (typeof document !== 'undefined') document.write(`Error while fetching Places: ${JSON.stringify(error)}`);
    //     console.error('Error while fetching Places', error);
    // });

    // $("#favorit").innerHTML


    // const currentUser = Parse.User.current();
    //     const myNewObject = new Places();


    // if (currentUser) {


    //     query.find().then((results) => {
    //         // You can use the "get" method to get the value of an attribute
    //         // Ex: response.get("<ATTRIBUTE_NAME>")
    //         // if (typeof document !== 'undefined') document.write(`Places found: ${JSON.stringify(results)}`);
    //         console.log('Places found', results);
    //     }, (error) => {
    //         // if (typeof document !== 'undefined') document.write(`Error while fetching Places: ${JSON.stringify(error)}`);
    //         console.error('Error while fetching Places', error);
    //     });

    //     query.get(objectData.results.items[i].title)
    //         .then(
    //             (result) => { console.log("already your favorite place!") },
    //             (error) => {
    //                 console.log(error)
    //                 myNewObject.set('title', objectData.results.items[i].title);
    //                 myNewObject.set('address', objectData.results.items[i].vicinity);
    //                 myNewObject.set('distance', objectData.results.items[i].distance);
    //                 myNewObject.set('latitude', objectData.results.items[i].position[1]);
    //                 myNewObject.set('longitude', objectData.results.items[i].position[0]);
    //                 myNewObject.set('user', currentUser.id);

    //                 myNewObject.save().then(
    //                     (result) => {
    //                         // if (typeof document !== 'undefined') document.write(`Favorites created: ${JSON.stringify(result)}`);
    //                         console.log('Place created', result);
    //                     },
    //                     (error) => {
    //                         // if (typeof document !== 'undefined') document.write(`Error while creating Favorites: ${JSON.stringify(error)}`);
    //                         console.error('Error while creating Favorites: ', error);
    //                     }
    //                 );
    //             }
    //         );
    // }
}

// console.log(data);

// const currentUser = Parse.User.current();

// if (currentUser) {

//     const Places = Parse.Object.extend('Places');
//     const myNewObject = new Places();

//     myNewObject.set('title', objectData.results.items[i].title);
//     myNewObject.set('address', objectData.results.items[i].vicinity);
//     myNewObject.set('distance', objectData.results.items[i].distance);
//     myNewObject.set('latitude', objectData.results.items[i].position[1]);
//     myNewObject.set('longitude', objectData.results.items[i].position[0]);
//     myNewObject.set('user', currentUser);


//     myNewObject.save().then(
//         (result) => {
//             // if (typeof document !== 'undefined') document.write(`Favorites created: ${JSON.stringify(result)}`);
//             console.log('Place created', result);
//         },
//         (error) => {
//             // if (typeof document !== 'undefined') document.write(`Error while creating Favorites: ${JSON.stringify(error)}`);
//             console.error('Error while creating Favorites: ', error);
//         }
//     );

// }
// }


var counter = 0;
var phone = [];
var web = [];
var positionsOfPhoneNumbers = [];

//dopisanie web,phone,otvaracie hodiny
function addContacts(data, coords) {
    for (i = 0; i < data.results.items.length; i++) {
        if (parseInt(data.results.items[i].distance, 10) < parseInt(distance, 10) * 1000) {
            $.ajax({
                url: data.results.items[i].href,
                type: 'GET',
                data: {
                    q: type,
                    in: coords + ';r=' + distance * 1000,
                    app_id: 'D8x0KnPC57PZDnJYjOE1',
                    app_code: 'GFk2twUkbiVzJQdEjeh9dw'
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Accept', 'application/json');
                },
                success: function (data) {
                    // console.log(data);
                    if ('website' in data.contacts) web.push(data.contacts.website[0].value); else web.push(0); /*document.getElementById('box' + counter).innerHTML += '<p>' + data.contacts.website[0].value + '</p>'*/
                    if ('phone' in data.contacts) phone.push(data.contacts.phone[0].value); else phone.push(0);/*document.getElementById('box' + counter).innerHTML += '<p>' + data.contacts.phone[0].value + '</p>'*/
                }
            });
            positionsOfPhoneNumbers.push(i);
        }
    }
    // positionsOfPhoneNumbers.reverse();
}


//
function callMyBaby(item) {
    // var index = positionsOfPhoneNumbers.indexOf(parseInt($(item).attr("id"), 10));
    // console.log(index);
    // console.log(phone[index]);
    // console.log(phone);
    console.log(objectData);

    $.ajax({
        url: objectData.results.items[parseInt($(item).attr('id'), 10)].href,
        type: 'GET',
        data: {
            q: type,
            in: coords + ';r=' + distance * 1000,
            app_id: 'D8x0KnPC57PZDnJYjOE1',
            app_code: 'GFk2twUkbiVzJQdEjeh9dw'
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
            if ('phone' in data.contacts) {
                window.plugins.CallNumber.callNumber(onSuccess, onError, data.contacts.phone[0].value, false);
            } else {
                item.remove();
                alert(data.name + ', no number specified');
            }
        }
    });


}

function onSuccess(result) {
    console.log("Success:" + result);
}

function onError(result) {
    console.log("Error:" + result);
}
//

function sendMeToURL(id) {

}
