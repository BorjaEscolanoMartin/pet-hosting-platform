<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\Storage;

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
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('photo');

        // ⬇️ Manejamos el archivo de forma separada
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $data['photo'] = $path;
        }

        $pet = $request->user()->pets()->create($data);

        return response()->json([
            ...$pet->toArray(),
            'photo_url' => $pet->photo ? asset("storage/{$pet->photo}") : null,
        ], 201);
        
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
            'photo' => 'nullable|image|max:5120',
        ]);

        $data = $request->except('photo');

        // Si se ha enviado una nueva foto
        if ($request->hasFile('photo')) {
            // Borra la anterior si existía
            if ($pet->photo && Storage::disk('public')->exists($pet->photo)) {
                Storage::disk('public')->delete($pet->photo);
            }

            // Guarda la nueva y actualiza el path
            $data['photo'] = $request->file('photo')->store('pets', 'public');
        }
        $pet->update($data);

        return response()->json($pet);
    }

    public function destroy(Request $request, $id)
    {
        $pet = $request->user()->pets()->findOrFail($id);
        $pet->delete();

        return response()->json(['message' => 'Mascota eliminada']);
    }

    public function show($id)
    {
        $pet = Pet::where('user_id', request()->user()->id)
                ->where('id', $id)
                ->firstOrFail();

        return response()->json($pet);
    }
}
