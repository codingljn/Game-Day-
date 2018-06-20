

var geocoder;
var map;
var markers = [];
var poi = [];

// "Firebase"
// Start Firebase
var config = {
    apiKey: "AIzaSyDqQd41pTAk4Tb5rmedg_RqzVUA0mZK2G4",
    authDomain: "maps-api-f3fbd.firebaseapp.com",
    databaseURL: "https://maps-api-f3fbd.firebaseio.com",
    projectId: "maps-api-f3fbd",
    storageBucket: "maps-api-f3fbd.appspot.com",
    messagingSenderId: "1031859626128"
};

firebase.initializeApp(config);

// Create variable to reference database

var database = firebase.database();
// Firebase

function startMap() {

    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (Progressive Field)
    var Latlng = new google.maps.LatLng(41.4962, -81.6852);

    var myOptions = {
        zoom: 16,
        center: Latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("gmap_display"), myOptions);
}

$(document).ready(function () {

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        poi = [];
    }
}

// clear Poi function
function clearPoi() {
    if (poi) {
        for (i in poi) {
            if (poi[i].getMap()) {
                poi[i].close();
            }
        }
    }
}

$("#button2").on("click", function () {
    findAddress();
})

// find address function
function findAddress() {
    var address = document.getElementById("map_loc").value;

    // script uses geocoder in order to find location by address name
    geocoder.geocode({ "address": address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is OK

            // center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);

            // store current coordinates into hidden variables
            document.getElementById("lat").value = results[0].geometry.location.lat();
            document.getElementById("lng").value = results[0].geometry.location.lng();

            // add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: "marker.png"
            });
        } else {
            var box = bootbox.alert ("Geocode was not successful for the following reason: " + status);
            box.find('.modal-content').css({ 'background-color': '#3CB371', 'font-size': '34px', 'line-height':'36px', 'height': '200px','color':'D3D3D3'}); 
            box.find(".btn-primary").removeClass("btn-primary").addClass("btn-danger");
            // Modal replaces alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

$("#button1").on("click", function () {
    findPlaces();
})
// find custom places function
function findPlaces() {

    // prepare variables (filter)
    var type = document.getElementById("gmap_type").value;

    var lat = document.getElementById("lat").value;
    var lng = document.getElementById("lng").value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: 500,
        types: [type]
    };
    // prepare request to Firebase
    var request2 = {
        location: document.getElementById("map_loc").value,
        types: document.getElementById("gmap_type").value
    };
    // send request to Google 
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
    //"Firebase"
    // Send new data to Firebase database
    database.ref().push(request2);
    //"Firebase"
}

// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we find something - clear map (overlays)
        clearOverlays();

        // and create new markers 
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        var box = bootbox.alert ("Tough luck! POI not available in a 546 yard radius. Please choose a different POI");
        box.find('.modal-content').css({ 'background-color': '#3CB371', 'font-size': '34px', 'line-height':'36px', 'height': '200px','color':'D3D3D3'}); 
        box.find(".btn-primary").removeClass("btn-primary").addClass("btn-danger");
    }
}

// creare single marker function
function createMarker(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    markers.push(mark);

    // prepare info window
    var infowindow = new google.maps.InfoWindow({
        content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name +
            '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function () {
        clearPoi();
        infowindow.open(map, mark);
    });
    poi.push(infowindow);
}

});

// initialization
google.maps.event.addDomListener(window, 'load', startMap);


