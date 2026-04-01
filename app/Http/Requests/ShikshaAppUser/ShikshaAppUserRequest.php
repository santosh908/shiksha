<?php

namespace App\Http\Requests\ShikshaAppUser;

use App\Models\ShikshaAppUser\ShikshaAppUser;
use Illuminate\Foundation\Http\FormRequest;

class ShikshaAppUserRequest extends FormRequest
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
            'name' => 'required | string | max:255',
            'email' => 'required|email|unique:users|regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            'dob' => 'required | string | max:255',
            'contact_name' => 'required | string | max:255',
            'is_active' => 'required',
            'permission' => 'required',

            'unique_user_check' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (
                        ShikshaAppUser::where('email', $this->input('email'))
                            ->exists()
                    ) {
                        $fail('A user with the same email and contact number has already registered.');
                    }
                }
            ],
        ];
    }


    public function message(): array
    {
        return [
            'ashery_leader_name.required' => 'The Ashery Leader name is required.',
            'ashery_leader_name.string' => 'The Ashery Leader name must be a string.',
            'ashery_leader_name.max' => 'The Ashery Leader name may not be greater than :max characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.regex' => 'Only Gmail addresses are allowed.',

            'dob.required' => 'The date of birth is required.',
            'dob.string' => 'The date of birth must be a valid string.',

            'contact_name.required' => 'The contact name is required.',
            'contact_name.string' => 'The contact name must be a string.',
            'contact_name.max' => 'The contact name may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',

            'permission.required' => 'The Permission is required.',
        ];
    }
}
