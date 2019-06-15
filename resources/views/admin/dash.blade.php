@extends('layouts.default')
@section('content')

<section class="dash-container">

    <div id="map">
    </div>

    <div class="dash">
        <div class="dash-item">
            <h2 class="title">Restaurants</h5>
            
            <div id="status">
                
            </div>
        
            <div class="create">
                <a href="/admin/restaurants/create"><button>Create New Restaurant</button></a>
            </div>
            
            @if ($rest->isEmpty())
                <h5>There are no restaurants current stored in the database</h5>
            @else
            <table>
                <tr>
                    <th>Name</th>
                    <th>Street</th>
                    <th>City</th>
                    <th>Postcode</th>
                </tr>
                @foreach ($rest as $item)
                {{-- set id on row to remove from dom after delete --}}
                <tr id="{{ $item->id }}">
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->street }}</td>
                    <td>{{ $item->city }}</td>
                    <td>{{ $item->postcode }}</td>
                    <td class="table-link" id="edit">Edit</td>
                    <td class="table-link">
                        <span class="delete" data-id="{{ $item->id }}">Delete</span>
                    </td>
                </tr>
                @endforeach
            </table>
            @endif
        </div>
    </div>
</section>

@endsection
