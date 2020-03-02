
const latitude = new URLSearchParams(window.location.search).get('latitude');
const longitude = new URLSearchParams(window.location.search).get('longitude');
const index = new URLSearchParams(window.location.search).get('index');
// const address = new URLSearchParams(window.location.search).get('address');
const title = new URLSearchParams(window.location.search).get('title');

var app = {
    initialize: function () {
        document.addEventListener(
            "deviceready",
            this.onDeviceReady.bind(this),
            false
        );
    },

    onDeviceReady: function () {
        this.map = L.map("map").setView([longitude, latitude], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(this.map);

        if (app.marker) {
            app.marker.remove();
        }
        app.marker = L.marker([longitude, latitude]).addTo(app.map);
    }
};

app.initialize();