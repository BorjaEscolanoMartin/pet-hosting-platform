<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PetController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->pets()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age' => 'nullable|integer',
            'size' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $pet = $request->user()->pets()->create($request->all());

        return response()->json($pet, 201);
    }

    public function update(Request $request, $id)
    {
        $pet = $request->user()->pets()->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age' => 'nullable|integer',
            'size' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $pet->update($request->all());

        return response()->json($pet);
    }

    public function destroy(Request $request, $id)
    {
        $pet = $request->user()->pets()->findOrFail($id);
        $pet->delete();

        return response()->json(['message' => 'Mascota eliminada']);
    }

}
