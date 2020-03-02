
// function isNumberKey(evt){
//     var charCode = (evt.which) ? evt.which : evt.keyCode
//     if (charCode > 31 && (charCode < 48 || charCode > 57))
//         return false;
//     return true;
// }

var app = {

	initialize: function () {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.addEventListener("backbutton", this.onBackKeyDown.bind(this), false);
	},

	onDeviceReady: function () {
		screen.orientation.lock('portrait');
    },

    // Handle the back button
    //
    onBackKeyDown: function() {
		navigator.app.exitApp();
	}

};

app.initialize();






