<?php

namespace App\Http\Requests\AllUserRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;
class AllUserRequest extends FormRequest
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
            'email' => 'required|email|regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            'name' => 'required|string|max:255',
            'Initiated_name' => 'required|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            'code' => [
                Rule::requiredIf(fn () => $this->role_name === 'BhaktiVriksha'),
                'string',
            ],
            'contact_number' => 'required|digits:10',
            'role_name' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Please select Ashray Leader if role is BhaktiVriksha.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already taken.',
            'email.regex' => 'The email must be a valid Gmail address.',

            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'name.max' => 'Name cannot exceed 255 characters.',

            'Initiated_name.string' => 'Initiated name must be a string.',
            'Initiated_name.max' => 'Initiated name cannot exceed 255 characters.',

            'dob.required' => 'Date of birth is required.',
            'dob.date' => 'Please provide a valid date of birth.',
            'dob.before' => 'Date of birth must be before today.',

            'contact_number.required' => 'Contact number is required.',
            'contact_number.digits' => 'Contact number must be exactly 10 digits.',

            'devotee_type.required' => 'Devotee type is required.',
            'devotee_type.in' => 'Devotee type must be one of the following: SA, CA, AL, BB.',

            'unique_user_check.required' => 'Please check for duplicate user registration.',

            'role_name.required' => 'Role is required.',
            'role_name.in' => 'Please select a valid role.',
        ];
    }

}
