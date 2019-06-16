require('./bootstrap')


let geocoder;
let map;
let restaurant;
let markers = [];

//load when ready
window.initMap = function () {

    geocoder = new google.maps.Geocoder()

    //default map options
    let mapOptions = {
        center: new google.maps.LatLng(52.4882913, -1.9048588),
        zoom: 13,
        mapTypeControl: false,
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions)

    // Try HTML5 geolocation to get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            map.setCenter(pos)
        })
    } else {
        // Browser doesn't support Geolocation
        console.log('Browser does not support geolocation')
    }

    //Fetch restaurants and put marker on map (ajax)
    fetchData();

    // change location to address on search
    $("#searchBtn").click(function (e) {

        let address = $("#address").val()
        //get longlat and place marker
        geoLocate(address);

        //center map
        map.setCenter(results[0].geometry.location)

        e.preventDefault()
    })
    //if enter pressed on input trigger click
    $('#address').keypress(function (e) {
        //Enter key pressed
        if (e.which == 13) {
            $('#searchBtn').click()
        }
        e.preventDefault();
    })
}


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

//fetch restaurant and place on map
let fetchData = function () {

    let infowindow = new google.maps.InfoWindow({
        content: ''
    })

    $.ajax({
        type: 'get',
        method: 'get',
        url: '/get',
        success: function (json) {
            restaurants = json.data
            //foreach 
            restaurants.forEach(function (el) {
                geoLocate(el.postcode)
            })
        },
        error: function (json) {
            console.log(json.responseText)
        }
    })
}

function geoLocate(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //save long lat
            lat = results[0].geometry.location.lat()
            long = results[0].geometry.location.lng()
            //set marker
            let marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            
            //keeping track of markers
            markers.push(marker)
        }
        else {
            // Geocode not working:()
            alert('Geocode was not successful for the following reason: ' + status)
        }
        
    });
}


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
