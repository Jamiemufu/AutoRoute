require('./bootstrap')

var geocoder
var map
var homeLocation

//load when ready
window.initMap = function () {

    geocoder = new google.maps.Geocoder()
    directionsService = new google.maps.DirectionsService
    directionsDisplay = new google.maps.DirectionsRenderer

    //default map options
    let mapOptions = {
        center: new google.maps.LatLng(52.4882913, -1.9048588),
        zoom: 13,
        mapTypeControl: false,
        mapTypeId: 'roadmap',
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions)
    directionsDisplay.setMap(map)

    // route();
    // Try HTML5 geolocation to get current location
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {
            homeLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            map.setCenter(homeLocation)
            console.log("INTIATED HOME: " + homeLocation.lat + ',' + homeLocation.lng)
        })
    } else {
        // Browser doesn't support Geolocation
        console.log('Browser does not support geolocation')
    }

    //Fetch restaurants and put marker on map (ajax)
    //Fetch and return nearest
}

$(document).ready(function () {
    $.ajax({
        type: 'get',
        method: 'get',
        url: '/get',
        success: function (json) {
            data = json.data

            //check if data is no emtpy
            if (data.length !== 0) {
                var nearestData = []
                //set max number for comparison
                var shortest = Number.MAX_VALUE

                //geocode and get long lats and distance
                data.forEach(element => {
                    shortest = getClosest(element, shortest, nearestData);
                })

                //set time out to allow nearestData to be corrext
                setTimeout(function () {
                    route(nearestData[0].lat, nearestData[0].long)
                }, 500);
            }
        },
        error: function (json) {
            console.log(json.responseText)
        }
    })
})

function getClosest(element, shortest, nearestData) {
    geocoder.geocode({ 'address': element.postcode }, function (results) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        distance = calcPathLength(lat, lng);
        //check if shortest and push to array
        if (distance < shortest) {
            shortest = distance;
            nearestData.push({
                'lat': lat,
                'long': lng,
                'distance': distance,
                name: element.name,
                street: element.street,
                city: element.city,
                postcode: element.postcode
            });
        }
    });
    return shortest;
}

function route(lat, long) {
    //hard set routes for now
    var start = new google.maps.LatLng(homeLocation)
    var end = new google.maps.LatLng(lat, long)
    //calculate distance
    // console.log(google.maps.geometry.spherical.computeDistanceBetween (start, end))
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
        }
    })
}

// calculate distance
function calcPathLength(lat, long) {
    let distance = 0
    let pos1 = new google.maps.LatLng(lat, long)
    let pos2 = new google.maps.LatLng(homeLocation.lat, homeLocation.lng)
    distance += google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2)
    return distance
}

// change location to address on search
$("#searchBtn").click(function (e) {

    let address = $("#address").val()

    //get longlat and place marker
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //save long lat
            homeLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
            //center map
            map.setCenter(homeLocation)
        }
        else {
            // Geocode not working:()
            alert('Geocode was not successful for the following reason: ' + status);
        }
    })
    console.log("NEW HOME: " + homeLocation.lat + ',' + homeLocation.lng)

})

//if enter pressed on input trigger click
$('#address').keypress(function (e) {
    //Enter key pressed
    if (e.which == 13) {
        e.preventDefault()
        $('#searchBtn').click()
    }
})


// Use AJAX for delete,update and create to save on API requests if vaildation fails
//create record
$("#create").click(function () {

    let token = $("meta[name='csrf-token']").attr("content")

    //clear errors on click
    $(".errors").text("")

    $.ajax({
        url: "/admin/restaurants/",
        method: 'post',
        type: 'post',
        data: {
            "_token": token,
            name: $("#name").val(),
            street: $("#street").val(),
            city: $("#city").val(),
            postcode: $("#postcode").val(),
        },
        success: function () {
            successMessage('Successfully created restaurant');
        },
        error: function (json) {
            setErrors(json)
        }
    })
})

//update record
$("#update").click(function () {

    let token = $("meta[name='csrf-token']").attr("content")
    let id = $("#id").val()

    //clear errors on click
    $(".errors").text("")

    $.ajax({
        url: "/admin/restaurants/" + id,
        method: 'PATCH',
        type: 'patch',
        data: {
            "_token": token,
            name: $("#name").val(),
            street: $("#street").val(),
            city: $("#city").val(),
            postcode: $("#postcode").val(),
        },
        success: function () {
            successMessage('Successfully updated restaurant');
        },
        error: function (json) {
            setErrors(json)
        }
    })
})

//delete record
$(".delete").click(function () {

    let message = 'Are you sure you want to delete this restaurant'

    if (confirm(message)) {

        let id = $(this).data("id")
        let token = $("meta[name='csrf-token']").attr("content")

        $.ajax({
            url: "/admin/restaurants/" + id,
            type: 'DELETE',
            data: {
                "id": id,
                "_token": token,
            },
            success: function () {
                deleteMessage(id)
            },
            error: function (json) {
                setErrors(json)
            }
        })
    }
})

function successMessage(message) {
    $(".errors").text(message)
    setInterval(() => {
        window.location = '/admin/restaurants'
    }, 5000)
}

function deleteMessage(id) {
    $('#' + id).fadeOut()
    $("#status").show().text('Successfully removed restaurant')
    setInterval(() => {
        $("#status").fadeOut()
    }, 5000)
}

function setErrors(json) {
    let errors = json.responseJSON.errors;
    Object.keys(errors).forEach(key => {
        $(".errors").append(errors[key] + "<br>")
    })
}
