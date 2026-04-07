<?php

namespace App\Application\ChangePassword\Validators;

use App\Application\ChangePassword\DTOs\ChangePasswordData;
use Illuminate\Support\Facades\Validator;

class ChangePasswordValidator
{
    public function validate(ChangePasswordData $data): void
    {
        Validator::make($data->toArray(), [
            'email' => 'required|string|email|exists:users,email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
        ])->validate();
    }
}
