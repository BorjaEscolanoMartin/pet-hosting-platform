<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function indexEmpresas()
    {
        return User::where('role', 'empresa')->get();
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'tamanos_aceptados' => 'nullable|array',
            'especie_preferida' => 'nullable|array',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user,
        ]);
    }

    public function show($id)
    {
        return User::with('hosts')->findOrFail($id);
    }
}
