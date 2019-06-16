<?php
use App\Http\Controllers\RestaurantsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('pages.home');
});
Route::get('/get', 'RestaurantsController@home')->name('home');
Route::get('/admin/restaurants/', 'RestaurantsController@index')->middleware('auth.basic')->name('dash');
Route::get('/admin/restaurants/create', 'RestaurantsController@create')->middleware('auth.basic')->name('create');
Route::post('/admin/restaurants/', 'RestaurantsController@store')->name('store');
Route::get('/admin/restaurants/edit/{id}', 'RestaurantsController@edit')->name('edit');
Route::delete('/admin/restaurants/{id}', 'RestaurantsController@destroy')->middleware('auth.basic')->name('delete');
Route::patch('/admin/restaurants/{id}', 'RestaurantsController@update')->name('update');
Route::get('/admin/logout', function() {
    Auth::logout();
    return redirect('/');
});