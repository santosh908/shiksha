<?php

namespace App\Http\Requests\Devotee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class StoreProfessionalInfo extends FormRequest
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
            'NoOfChant' => 'required|integer|min:0|max:99',
            'ChantingStartDate' => 'required|date|before:today|after_or_equal:1900-01-01',
            'RegulativePrinciples' => 'required|array', // Updated to array
            'RegulativePrinciples.*' => 'integer', // Each item in the array should be an integer
            'BooksRead' => 'required|array', // Updated to array
            'BooksRead.*' => 'integer', // Each item in the array should be an integer
            'SpendTimeHearingLecture' => 'required|string|max:255', // Adjusted to string
        ];
    }
    public function messages(): array
    {
        return [
            'NoOfChant.required' => 'Please specify how many rounds you chant.',
            'NoOfChant.integer' => 'The number of rounds must be an integer.',
            'NoOfChant.min' => 'The number of rounds must be at least 0.',
            'NoOfChant.max' => 'The number of rounds cannot exceed 99.',
            'ChantingStartDate.required' => 'The chanting start date is required.',
            'ChantingStartDate.date' => 'The chanting start date must be a valid date.',
            'ChantingStartDate.before' => 'The chanting start date must be before today.',
            'ChantingStartDate.after_or_equal' => 'The chanting start date must be on or after January 1, 1900.',
            'RegulativePrinciples.required' => 'You must select at least one regulative principle.',
            'RegulativePrinciples.array' => 'Regulative principles must be an array.',
            'RegulativePrinciples.*.integer' => 'Each regulative principle must be a valid integer.',
            'BooksRead.required' => 'You must select at least one book.',
            'BooksRead.array' => 'Books read must be an array.',
            'BooksRead.*.integer' => 'Each book must be a valid integer.',
            'SpendTimeHearingLecture.required' => 'The time spent hearing lectures is required.',
            'SpendTimeHearingLecture.string' => 'The time spent hearing lectures must be a string.',
            'SpendTimeHearingLecture.max' => 'The time spent hearing lectures cannot exceed 255 characters.',
        ];
    }
}
