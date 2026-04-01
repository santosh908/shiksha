<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function dashboard() 
    {
        $user = Auth::user()->load('roles', 'permissions');
    
        if ($user->hasRole('Devotee')) {
            return Inertia::render('Devotee/dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('Devotee'), // Extract only the role names
             ]);

        } elseif ($user->hasRole('CoOrdinator')) {
            return Inertia::render('CoOrdinator/Dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('CoOrdinator'), // Extract only the role names
             ]);
        } elseif ($user->hasRole('AsheryLeader')) {
            return Inertia::render('AsheryLeader/dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('AsheryLeader'), // Extract only the role names
             ]);
        } elseif ($user->hasRole('SuperAdmin')) {
            return Inertia::render('SuperAdmin/dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('SuperAdmin'), // Extract only the role names
             ]);
        } 
        elseif ($user->hasRole('Admin')) {
            return Inertia::render('SuperAdmin/dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('Admin'), // Extract only the role names
             ]);
        }
        else {
            return Inertia::render('User/Dashboard',[
                'user' => $user->toArray(),
                'roles' => $user->roles->pluck('devotee'), // Extract only the role names
             ]);
        }
    }
}
