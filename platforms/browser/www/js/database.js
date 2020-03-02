

var dataObject;
let type = "rest";

const Places = Parse.Object.extend('Places');
const query = new Parse.Query(Places);

const currentUser = Parse.User.current();

if (currentUser) {

  $("#favorite-login").hide();

  query.equalTo("user", currentUser.id);
  query.find().then((results) => {
    dataObject = results;
    let element = document.getElementById("main-box");
    // console.log(results[0].get("title"));
    for (i = 0; i < results.length; i++) {

    $("#favorite-no-results").hide();

      element.innerHTML +=

        '<div id="box' + i + '">' +
        '<p class="title">' + results[i].get("title") + '</p> <hr />' +
        '<p class="address">' + results[i].get("address") + '</p>' +
        '<p class="distance">' + results[i].get("distance") + ' meters away</p>' +
        '<div id="flex">' +
        '<a href="map.html?distance=' + results[i].get("distance") + '&type=' + type +
        '&longitude=' + results[i].get("longitude") + '&latitude=' + results[i].get("latitude") +
        '&index=' + i + '&title=' + results[i].get("title") + '">' +
        '<i class="fas fa-map-marked-alt" style="font-size:48px;color:grey;margin:0.8rem;"></i></a>' +
        '<i class="fas fa-minus" id="minus' + i + '" onclick="del(' + i + ');" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
        // '<i class="fas fa-phone" id="' + i + '" onclick="callMyBaby(this);" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
        // '<i class="fas fa-address-card" id="web' + i + '" onclick="sendMeToURL(this);" style="font-size:48px;color:grey;margin:0.8rem;"></i>' +
        '</div> </div>';
    }
    // if (typeof element !== 'undefined') element.innerText = `${JSON.stringify(results)}`;
  }, (error) => {
    if (typeof document !== 'undefined') document.write(`Error while fetching Places: ${JSON.stringify(error)}`);
    console.error('Error while fetching Places', error);
  });

}else{
  $("#favorite-no-results").hide();
}

function del(id) {
  console.log(dataObject[id].id);
  // console.log(id);
  // document.getElementById('box'+id).style.display = 'none';

  $("#box"+id).hide(1000,function(){
    // ("#box"+id).remove();
  })

  query.get(dataObject[id].id).then((object) => {
    object.destroy().then((response) => {
      // if (typeof document !== 'undefined') document.write(`Deleted Places: ${JSON.stringify(response)}`);
      console.log('Deleted Places', response);
      // window.reload();
    }, (error) => {
      // if (typeof document !== 'undefined') document.write(`Error while deleting Places: ${JSON.stringify(error)}`);
      console.error('Error while deleting Places', error);
    })
  })
}

