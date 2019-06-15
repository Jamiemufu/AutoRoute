<header>
    <nav>

        <div>
            <h5>Creative Insight Search</h5>
        </div>

        <ul>

            <li id="search">

                <form action="">
                    <input name="address" type="text" placeholder="Enter your Postcode/Address">
                    <button id="searchBtn"><i class="fas fa-search"></i>Search</button>
                </form>

            </li>

            <a href="/">
                <li>Home</li>
            </a>

            <a href="/admin/restaurants">
                <li>Restaurants</li>
            </a>
            {{-- ony show logout if user authenticated --}}
            @if (Auth::check())

                <a href="/admin/logout">
                    <li>Logout</li>
                </a>

            @endif

        </ul>

    </nav>
</header>
