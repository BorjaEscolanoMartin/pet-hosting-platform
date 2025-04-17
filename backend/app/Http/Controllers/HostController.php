<?php

namespace App\Http\Controllers;

use App\Models\Host;
use Illuminate\Http\Request;

class HostController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->hosts()->get(); // solo los del usuario autenticado
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:particular,empresa',
            'location' => 'nullable|string',
        ]);

        $host = $request->user()->hosts()->create($validated);

        return response()->json($host, 201);
    }

    public function show(Request $request, $id)
    {
        $host = $request->user()->hosts()->findOrFail($id);
        return response()->json($host);
    }

    public function update(Request $request, $id)
    {
        $host = $request->user()->hosts()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:particular,empresa',
            'location' => 'nullable|string',
        ]);

        $host->update($validated);

        return response()->json($host);
    }

    public function destroy(Request $request, $id)
    {
        $host = $request->user()->hosts()->findOrFail($id);
        $host->delete();

        return response()->json(['message' => 'Cuidador eliminado']);
    }
}

