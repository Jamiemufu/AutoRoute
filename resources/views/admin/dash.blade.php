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
            {{-- desktop view --}}
            <table class="desktop">
                <tr>
                    <th class="name">Name</th>
                    <th class="street">Street</th>
                    <th class="city">City</th>
                    <th class="postcode">Postcode</th>
                </tr>
                @foreach ($rest as $item)
                {{-- set id on row to remove from dom after delete --}}
                <tr id="{{ $item->id }}">
                    <td class="name">{{ $item->name }}</td>
                    <td class="street">{{ $item->street }}</td>
                    <td class="city">{{ $item->city }}</td>
                    <td class="postcode">{{ $item->postcode }}</td>
                    <td class="table-link">
                        <a href="{{ route('edit', ['id' => $item->id]) }}">
                            <span>Edit</span>
                        </a>
                    </td>
                    <td class="table-link">
                        <span class="delete" data-id="{{ $item->id }}">Delete</span>
                    </td>
                </tr>
                @endforeach
            </table>
            {{-- mobile view --}}
            <div class="mobile">
                <hr>
                <table>
                    @foreach ($rest as $item)
                    {{-- set id on row to remove from dom after delete --}}
                    <tr id="{{ $item->id }}"></tr>
                    <tr>
                        <td class="name">Name: {{ $item->name }}</td>
                    </tr>
                    <tr>
                        <td class="street">Street: {{ $item->street }}</td>
                    </tr>
                    <tr>
                        <td class="city">City: {{ $item->city }}</td>
                    </tr>
                    <tr>
                        <td class="postcode">Postcode: {{ $item->postcode }}</td>
                    </tr>
                    <tr>
                        <td class="table-link">
                            <a href="{{ route('edit', ['id' => $item->id]) }}">
                                <span>Edit</span>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td class="table-link">
                            <span class="delete" data-id="{{ $item->id }}">Delete</span>
                        </td>
                    </tr>
                    @endforeach
                </table>
                <hr>
            </div>
            @endif
        </div>
    </div>
</section>

@endsection
