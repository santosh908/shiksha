<?php

namespace App\Http\Requests\ShikshaLevel;

use Illuminate\Foundation\Http\FormRequest;

class ShikshaLevelRequest extends FormRequest
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
            'exam_level' => 'required | string | max:255',
            'is_active' => 'required|string|in:Y,N',
        ];
    }

    public function messages()
    {
        return [

            'exam_level.required' => 'The exam name is required.',
            'exam_level.string' => 'The exam name must be a string.',
            'exam_level.max' => 'The exam name may not be greater than 255 characters.',

            'is_active.required' => 'The active status is required.',
            'is_active.in' => 'The active status must be true or false.',
        ];
    }
}
