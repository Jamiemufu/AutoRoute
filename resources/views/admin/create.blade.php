@extends('layouts.default')
@section('content')


<section class="dash-container">

    <div id="map">
    </div>

    <div class="dash">
        <div class="dash-item">

            <h2 class="title pad">Create New Restaurant</h2>
            
                <div class="errors">
                    
                </div>
           
            <form>
                @csrf
                <div class="input">
                    <label for="name">Name: *</label>
                    <input type="text" name="name" required placeholder="Name" id="name">
                </div>


                <div class="input">
                    <label for="street">Street: *</label>
                    <input type="text" name="street" required placeholder="Street" id="street">
                </div>

                <div class="input">
                    <label for="city">Town/City: *</label>
                    <input type="text" name="city" required placeholder="City" id="city">
                </div>

                <div class="input">
                    <label for="postcode">Postcode: *</label>
                    <input type="text" name="postcode" required placeholder="Postcode" id="postcode">
                </div>

                <button id="create" type="button">Create</button>

            </form>

        </div>
    </div>

</section>

@endsection
