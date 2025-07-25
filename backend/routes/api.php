<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Broadcast;

use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\HostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CuidadoresController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageController;

use App\Services\GeolocationService;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReviewController;


/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/

// Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Credenciales incorrectas.'],
        ]);
    }

    // Revocar tokens existentes para evitar acumulación
    $user->tokens()->delete();
    
    // Crear nuevo token
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
        'message' => 'Inicio de sesión exitoso'
    ]);
});

// Registro
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6',
        'postal_code' => 'required|string|max:10',
    ]);

    $coords = GeolocationService::fromPostalCode($request->postal_code);    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role' => 'cliente',
        'postal_code' => $request->postal_code,
        'latitude' => $coords['lat'] ?? null,
        'longitude' => $coords['lon'] ?? null,
    ]);

    if ($coords) {
        $user->latitude = $coords['lat'];
        $user->longitude = $coords['lon'];
        $user->save();

        logger(['lat' => $coords['lat'], 'lng' => $coords['lon']]);
    }

    // Crear token para el nuevo usuario
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
        'message' => 'Registro exitoso'
    ]);
});

// Logout
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    // Revocar el token actual
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Sesión cerrada exitosamente'
    ]);
});

// Logout de todos los dispositivos
Route::middleware('auth:sanctum')->post('/logout-all', function (Request $request) {
    // Revocar todos los tokens del usuario
    $request->user()->tokens()->delete();

    return response()->json([
        'message' => 'Sesión cerrada en todos los dispositivos'
    ]);
});

// Empresas específicas (ruta pública)
Route::get('/empresas', [UserController::class, 'indexEmpresas']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas con Sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user', [UserController::class, 'update']);

    // Mascotas
    Route::get('/pets', [PetController::class, 'index']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::put('/pets/{id}', [PetController::class, 'update']);
    Route::delete('/pets/{id}', [PetController::class, 'destroy']);
    Route::get('/pets/{id}', [PetController::class, 'show']);

    // Hosts
    Route::apiResource('hosts', HostController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    
    // Precios de servicios para hosts
    Route::get('/hosts/{host}/service-prices', [HostController::class, 'getServicePrices']);
    Route::post('/hosts/{host}/service-prices', [HostController::class, 'updateServicePrices']);

    // Cuidadores y empresas (usuarios por rol)
    Route::get('/users', function (Request $request) {
        $role = $request->query('role');
        return $role ? User::where('role', $role)->get() : User::all();
    });

    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/host', [ReservationController::class, 'forHost']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    });    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::get('/cuidadores/{hostId}/reviews', [ReviewController::class, 'index']);
    Route::post('/cuidadores/{hostId}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

});

/*
|--------------------------------------------------------------------------
| Ruta de depuración (opcional, eliminar en producción)
|--------------------------------------------------------------------------
*/

Route::get('/check', function (Request $request) {
    return response()->json([
        'cookies' => $_COOKIE,
        'session' => session()->all(),
        'user' => $request->user(),
    ]);
});

Route::get('/cuidadores', [CuidadoresController::class, 'index']);
Route::get('/cuidadores/{id}', [CuidadoresController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Rutas del Sistema de Chat (Protegidas)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Rutas de Chat
    Route::apiResource('chats', ChatController::class);
    Route::post('/chats/private', [ChatController::class, 'createPrivateChat']);
    
    // Rutas de Mensajes
    Route::get('/messages/unread-count', [MessageController::class, 'getUnreadCount']);
    Route::get('/chats/{chat}/messages', [MessageController::class, 'index']);
    Route::post('/chats/{chat}/messages', [MessageController::class, 'store']);
    Route::get('/chats/{chat}/messages/{message}', [MessageController::class, 'show']);
    Route::put('/chats/{chat}/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/chats/{chat}/messages/{message}', [MessageController::class, 'destroy']);
    Route::patch('/chats/{chat}/messages/{message}/read', [MessageController::class, 'markAsRead']);
    Route::patch('/chats/{chat}/messages/read-all', [MessageController::class, 'markAllAsRead']);
});

