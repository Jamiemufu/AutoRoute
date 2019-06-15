require('./bootstrap')


//initialise map
window.initMap = function () {
    let lat
    let long

    let geocoder = new google.maps.Geocoder()

    let map = new google.maps.Map(document.getElementById('map'), {
        //default map center to Birmingham
        center: new google.maps.LatLng(52.4882913, -1.9048588),
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false
    })
    // Try HTML5 geolocation.
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
        this.console.log('Browser does not support geolocation')
    }
    /* TODO: AJAX GET NEAREST RESTAURANT FROM DATABASE AND ROUTE */
    
    // change location to address on search
    $("#searchBtn").click(function (e) {
        event.preventDefault();
        let address = $("#address").val()
        
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //save long lat
                lat = results[0].geometry.location.lat()
                long = results[0].geometry.location.lng()
                //set marker
                let marker = new google.maps.Marker({
                    map     : map,
                    position: results[0].geometry.location
                })
                //center map
                map.setCenter(results[0].geometry.location)
            } else {
                alert('Geocode was not successful for the following reason: ' + status)
            }
        })
    })
    //if enter pressed on input trigger click
    $('#address').keypress(function(e){
        //Enter key pressed
        if(e.which == 13) {
            $('#searchBtn').click()
        }
    })
}

// Use AJAX for delete,update and create to save on API requests if vaildation fails
//create via ajax to reduce API requests on failed validated
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

//create via ajax to reduce API requests on failed validated
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

// delete record
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
