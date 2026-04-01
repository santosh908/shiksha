<?php

namespace App\Services\ChangePassword;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePasswordServices
{

    public function UpdatePassword($request)
    {
        $user = User::where('email', $request['email'])->first();

        if (!$user) {
            throw new \Exception('User not found.');
        }
        
        $user->password = Hash::make($request['password']);
        $user->save();

        return $user;
    }


}
