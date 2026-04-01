<?php

namespace App\Http\Requests\EducationStore;

use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
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
            'eduction_name' => 'required | string | max:255',
            'is_active' =>  'required|in:Y,N',
        ];
    }

    public function message(): array
    {
        return [

            'eduction_name.required' => 'The Education Details is required.',
            'eduction_name.string' => 'The Education Details must be a string.',
            'eduction_name.max' => 'The Education Details may not be greater than 255 characters.',
            'is_active.required' => 'The active status is required.',
            'is_active.boolean' => 'The active status must be true or false.',
        ];
    }
}
