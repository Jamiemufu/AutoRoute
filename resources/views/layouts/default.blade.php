<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{csrf_token()}}">
    <title>Creative Insight Test</title>
    {{-- css --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    {{-- font awesome --}}
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
</head>
<body>
    
    @include('shared.header')

    <main id="main">
        @yield('content')
    </main>

    {{-- js scripts --}}
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAPS_API') }}&callback=initMap" async defer></script>
   
</body>
</html>