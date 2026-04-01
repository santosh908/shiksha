<?php

namespace App\Http\Requests\Devotee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class StoreHearingReading extends FormRequest
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
            'MemorisedPrayers' => 'required|array', // Updated to array
            'MemorisedPrayers.*' => 'integer', // Each item in the array should be an integer
            'Seminar' => 'required|array', // Updated to array
            'Seminar.*' => 'integer', // Each item in the array should be an integer
            'ShastriDegree' => 'required|string|max:255', // Adjusted to string
        ];
    }
    public function messages(): array
    {
        return [
            'MemorisedPrayers.required' => 'You must select at least one Memorised Prayers.',
            'MemorisedPrayers.array' => 'Memorised Prayers must be an array.',
            'Seminar.required' => 'You must select at least one Seminar Prayers.',
            'Seminar.array' => 'Seminar Prayers must be an array.',
            'ShastriDegree.required' => 'The ShastriDegree is required.',
            'ShastriDegree.string' => 'The tShastriDegree must be a string.',
            'ShastriDegree.max' => 'The ShastriDegree cannot exceed 255 characters.',
        ];
    }
}
