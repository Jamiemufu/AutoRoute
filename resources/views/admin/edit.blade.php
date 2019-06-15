@extends('layouts.default')
@section('content')


<section class="dash-container">

    <div id="map">
    </div>

    <div class="dash edit">
        <div class="dash-item">

            <h2 class="title pad">Edit Restaurant</h2>
            
                <div class="errors">
                    
                </div>
           
            <form>
                @csrf
                @method('PATCH')
                {{-- hidden value to grab id --}}
                <input type="hidden" name="id" value="{{ $rest->id }}" id="id">
                <div class="input">
                    <label for="name">Current Name: <em>{{ $rest->name }}</em></label>
                    <input type="text" name="name" required placeholder="Enter New Name" id="name" value="{{ $rest->name }}">
                </div>


                <div class="input">
                    <label for="street">Current Street: <em>{{ $rest->street }}</em></label>
                    <input type="text" name="street" required placeholder="Enter New Street" id="street" value="{{ $rest->street }}">
                </div>

                <div class="input">
                    <label for="city">Current Town/City: <em>{{ $rest->city }}</em></label>
                    <input type="text" name="city" required placeholder="Enter New City" id="city" value="{{ $rest->city }}">
                </div>

                <div class="input">
                    <label for="postcode">Current Postcode: <em>{{ $rest->postcode }}</em></label>
                    <input type="text" name="postcode" required placeholder="Enter New Postcode" id="postcode" value="{{ $rest->postcode }}">
                </div>

                <button id="update" type="button">Update</button>

            </form>

        </div>
    </div>

</section>

@endsection
