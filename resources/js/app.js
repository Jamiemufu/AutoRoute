
require('./bootstrap')


//initialise map and geolocate to current location
window.initMap = function () {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(52.4882913, -1.9048588),
        zoom: 12,
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
        //show search
        // $('#search').show();
        this.console.log('Browser does not support geolocation')
    }
}

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
                $('#' + id).fadeOut()
                $("#status").show().text('Successfully removed restaurant');
                setInterval(() => {
                    $("#status").fadeOut()
                }, 5000)
            }
        })
    }
})

//create via ajax to reduce API requests on failed validated
$("#create").click(function () {
    let token = $("meta[name='csrf-token']").attr("content")
    //clear errors on click
    $(".errors").text("");

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
        success: function (json) {
            $(".errors").text("Successfully created restaurant")
            setInterval(() => {
                window.location = '/admin/restaurants'
            }, 5000);
        },
        error: function (json) {
            let errors = json.responseJSON.errors
            Object.keys(errors).forEach(key => {
                $(".errors").append(errors[key] + "<br>")
            });
        }
    });
})

//TODO EDIT

//SEARCH IN NAV

//MAP MARKERS FROM DATABASE
