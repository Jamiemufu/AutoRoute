<header>
    <nav>

        <div>
            <h5>Auto Router</h5>
        </div>

        <ul>
            {{-- hide search button on all routes except home --}}
            @if (Request::path() == '/')
                <li id="search">
                    <form action="" id="searchForm">
                        <input name="address" type="text" placeholder="Enter your Postcode/Address" id="address">
                        <button id="searchBtn" type="button">
                            <i class="fas fa-search"></i>Search
                        </button>
                    </form>
                </li>
            @endif

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
