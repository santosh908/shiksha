<?php

namespace App\Http\Requests\ChangePassword;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|string|email|exists:users,email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'The email field is required.',
            'email.string' => 'The email must be a valid string.',
            'email.email' => 'Please provide a valid email address.',
            'email.exists' => 'This email does not exist in our records.',

            'password.required' => 'The new password field is required.',
            'password.string' => 'The new password must be a valid string.',

            'confirm_password.required' => 'The confirm password field is required.',
            'confirm_password.string' => 'The confirm password must be a valid string.',
            'confirm_password.same' => 'The confirm password must match the new password.',
        ];
    }

}
