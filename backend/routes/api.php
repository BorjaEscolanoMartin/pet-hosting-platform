<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

// Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user || ! \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Credenciales incorrectas.'],
        ]);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return response()->json($user);
});

// Registro
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6',
        'role' => 'required|in:cliente,cuidador,empresa',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role' => $request->role,
    ]);

    Auth::login($user);

    return response()->json($user);
});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();                         // Cierra la sesión
    $request->session()->invalidate();      // Invalida la sesión actual
    $request->session()->regenerateToken(); // Regenera el token CSRF

    return response()->json(['message' => 'Sesión cerrada']);
});

// Ruta protegida
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/check', function (\Illuminate\Http\Request $request) {
    return response()->json([
        'cookies' => $_COOKIE,
        'session' => session()->all(),
        'user' => $request->user(),
    ]);
});

