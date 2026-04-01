<?php

namespace App\Http\Requests\AshrayLeader;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AshrayLeaderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set to true if no authorization logic is needed, otherwise implement your logic
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users|regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            'name' => 'required|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            'contact_number' => 'required|string|min:10|max:15|regex:/^[1-9][0-9]{9,14}$/|unique:users',
            'is_active' => 'required',
        ];
    }


    public function messages(): array
    {
        return [
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.regex' => 'Only Gmail addresses are allowed.',
            
            'name.required' => 'Full name is required.',
            'name.string' => 'Full name must be a valid string.',
            'name.max' => 'Full name cannot be longer than 255 characters.',

            'dob.required' => 'Date of birth is required.',
            'dob.date' => 'Please provide a valid date.',
            'dob.before' => 'Date of birth must be before today.',
            'dob.after_or_equal' => 'Date of birth must be on or after January 1, 1900.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',

            'contact_number.required' => 'Contact number is required.',
            'contact_number.unique' => 'This contact number is already registered.',
            'contact_number.regex' => 'The contact number cannot start with a 0 and must be between 10 and 15 digits.',
        ];
    }
}