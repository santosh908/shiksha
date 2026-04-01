<?php

namespace App\Http\Requests\Devotee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class StoreSuperAdminDevoteeRegisration extends FormRequest
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
            //'email' => 'required|email|unique:users|regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            'name' => 'required|string|max:255',
            'Initiated_name' => 'nullable|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            //'contact_number' => 'required|string|min:10|max:15|regex:/^[1-9][0-9]{9,14}$/|unique:users',
            'Educational' => 'required|string|max:255',
            'MaritalStatus' => 'required|string|max:10',
            'Profession' => 'required|string|max:10',
            'JoinedSckon' => 'required|date|before:today|after_or_equal:1900-01-01',
            'CurrentAddress' => 'required|string|max:255',
            'Socity_Name' => 'required|string|max:255',
            'Sector_Area' => 'required|string|max:255',
            'Pincode' => 'required|string|max:6|min:6',
            'State' => 'required|string|max:10',
            'District' => 'required|string|max:10',
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

        'Initiated_name.required' => 'Initiated name is required.',
        'Initiated_name.string' => 'Initiated name must be a valid string.',
        'Initiated_name.max' => 'Initiated name cannot be longer than 255 characters.',

        'dob.required' => 'Date of birth is required.',
        'dob.date' => 'Please provide a valid date.',
        'dob.before' => 'Date of birth must be before today.',
        'dob.after_or_equal' => 'Date of birth must be on or after January 1, 1900.',

        'contact_number.required' => 'Contact number is required.',
        'contact_number.unique' => 'This contact number is already registered.',
        'contact_number.regex' => 'The contact number cannot start with a 0 and must be between 10 and 15 digits.',

        'Educational.required' => 'The educational qualification field is required.',
        'Educational.string' => 'The educational qualification field must be a string.',
        'Educational.max' => 'The educational qualification field may not be greater than 255 characters.',
        
        'Profession.required' => 'The profession field is required.',
        'Profession.string' => 'The profession field must be a string.',
        'Profession.max' => 'The profession field may not be greater than 10 characters.',
        
        'SpiritualMaster.required' => 'The spiritual master field is required.',
        'SpiritualMaster.string' => 'The spiritual master field must be a string.',
        'SpiritualMaster.max' => 'The spiritual master field may not be greater than 255 characters.',
        
        'JoinedSckon.required' => 'The joined ISKCON date field is required.',
        'JoinedSckon.date' => 'The joined ISKCON date field must be a valid date.',
        'JoinedSckon.before' => 'The joined ISKCON date must be a date before today.',
        'JoinedSckon.after_or_equal' => 'The joined ISKCON date must be a date after or equal to 1900-01-01.',
        
        'CurrentAddress.required' => 'The current address field is required.',
        'CurrentAddress.string' => 'The current address field must be a string.',
        'CurrentAddress.max' => 'The current address field may not be greater than 255 characters.',
        
        'PrmanentAddress.required' => 'The permanent address field is required.',
        'PrmanentAddress.string' => 'The permanent address field must be a string.',
        'PrmanentAddress.max' => 'The permanent address field may not be greater than 255 characters.',
        
        'Pincode.required' => 'The pincode field is required.',
        'Pincode.string' => 'The pincode field must be a string.',
        'Pincode.max' => 'The pincode field must be exactly 6 characters.',
        'Pincode.min' => 'The pincode field must be exactly 6 characters.',
        
        'State.required' => 'The state field is required.',
        'State.string' => 'The state field must be a string.',
        'State.max' => 'The state field may not be greater than 10 characters.',
        
        'District.required' => 'The district field is required.',
        'District.string' => 'The district field must be a string.',
        'District.max' => 'The district field may not be greater than 10 characters.',
        ];
    }
}
