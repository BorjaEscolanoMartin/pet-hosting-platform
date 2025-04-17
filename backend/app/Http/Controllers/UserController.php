<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function indexEmpresas()
{
    return User::where('role', 'empresa')->get();
}

}
