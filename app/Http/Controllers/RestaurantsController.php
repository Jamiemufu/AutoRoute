<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ValidateForm;
use Symfony\Component\HttpFoundation\Response;

class RestaurantsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        $rest = \App\Restaurant::all();

        return view('admin.dash')->with('rest', $rest);
    }

    public function home()
    {
        $rest = \App\Restaurant::all(['id', 'name', 'street', 'city', 'postcode']);
        
        return response()->json([
            'data' => $rest
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ValidateForm $request
     * @return \Illuminate\Http\Response
     */
    public function store(ValidateForm $request)
    {
        //ValidateForm formRequest
        $validated = $request->validated();

        $rest = new \App\Restaurant;

        $rest->fill($validated);
        $rest->save();

        return response()->json();
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $rest = \App\Restaurant::find($id);

        return view('admin.edit')->with('rest', $rest);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ValidateForm $request, $id)
    {
        //ValidateForm formRequest
        $validated = $request->validated();

        $rest = \App\Restaurant::find($id);

        $rest->update($validated);

        return Response()->json();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // find by id
		$rest = \App\Restaurant::find($id);

		$rest->delete();

        return response()->json();
    }
}
