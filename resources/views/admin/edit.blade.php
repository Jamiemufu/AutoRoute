@extends('layouts.default')
@section('content')


<section class="dash-container">

    <div id="map">
    </div>

    <div class="dash">
        <div class="dash-item">

            <h2 class="title pad">Create New Restaurant</h2>

            <form method="POST" action="{{ action('RestaurantsController@store') }}">
                @csrf
                <div class="input">
                    <label for="name">Name: *</label>
                    <input type="text" name="name" required placeholder="Name">
                </div>


                <div class="input">
                    <label for="street">Street: *</label>
                    <input type="text" name="street" required placeholder="Street">
                </div>

                <div class="input">
                    <label for="city">Town/City: *</label>
                    <input type="text" name="city" required placeholder="City">
                </div>

                <div class="input">
                    <label for="postcode">Postcode: *</label>
                    <input type="text" name="postcode" required placeholder="Postcode">
                </div>

                <button id="create" type="submit">Create</button>

            </form>

        </div>
    </div>

</section>

@endsection
