
require('./bootstrap')


//initialise map and geolocate to current location
window.initMap = function () {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(52.4882913, -1.9048588),
        zoom: 12,
        mapTypeControl: false
    })
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos)
        });
    } else {
        // Browser doesn't support Geolocation
        //show search
        $('#search').show();
        this.console.log('Browser does not support geolocation')
    }
}