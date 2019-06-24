require('./bootstrap')

let geocoder
let map
let homeLocation
let nearestData = []
//set the shortest number globally
let shortestNumber = Number.MAX_SAFE_INTEGER

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
}

getRoutes();

function getRoutes() {
        $.ajax({
            type: 'get',
            method: 'get',
            url: '/get',
            success: function (json) {
                data = json.data;                
                //check if data is not emtpy
                if (data.length !== 0) {
                    //geocode and get long lats and distance
                    data.forEach(element => {
                        getShortest(element, nearestData);
                    });
                    //set time out to allow nearestData to be corrext
                    setTimeout(function () {
                        //nearest data always pushes shortest distance to end of array, so use last index to get shortest
                        route(nearestData[nearestData.length - 1].lat, nearestData[nearestData.length - 1].long);
                    }, 1000);
                }
            },
            error: function (json) {
                console.log(json.responseText);
            }
        });
    
}

function getShortest(element, nearestData) {
    //geocode the postcode of the element passed in to get long/lat to calc distance
    geocoder.geocode({ 'address': element.postcode }, function (results) {
        lat = results[0].geometry.location.lat()
        lng = results[0].geometry.location.lng()
        distance = calcPathLength(lat, lng)
        //check if shortest and push to array
        //now working after moving comparison number globally
        if (distance < shortestNumber) {
            shortestNumber = distance
            nearestData.push({
                'lat': lat,
                'long': lng,
                'distance': distance,
                name: element.name,
                street: element.street,
                city: element.city,
                postcode: element.postcode
            })
        }
    })
}

function route(lat, long) {
   //set start to homelocation (from page loading or clicking search)
    let start = new google.maps.LatLng(homeLocation)
    let end = new google.maps.LatLng(lat, long)
    
    let request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }
    
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            console.log(result.routes[0].legs[0].distance)
            console.log(result.routes[0].legs[0].duration)
            directionsDisplay.setDirections(result)
        }
    })
}

// calculate distance
function calcPathLength(lat, long) {
    let distance = 0
    let pos1 = new google.maps.LatLng(lat, long)
    let pos2 = new google.maps.LatLng(homeLocation.lat, homeLocation.lng)
    distance += google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2)
    return Math.round(distance * 10) / 10;
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
            setTimeout(function () {
                //nearest data always pushes shortest distance to end of array, so use last index to get shortest
                route(nearestData[nearestData.length - 1].lat, nearestData[nearestData.length - 1].long);
            }, 1000);
        }
        else {
            // Geocode not working:()
            alert('Geocode was not successful for the following reason: ' + status);
        }
    })    
    

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
