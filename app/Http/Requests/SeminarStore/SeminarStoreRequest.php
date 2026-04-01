<?php

namespace App\Http\Requests\SeminarStore;

use Illuminate\Foundation\Http\FormRequest;

class SeminarStoreRequest extends FormRequest
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
            'seminar_name_english' => 'required | string | max:255',
            'seminar_name_hindi' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }

    public function message(): array
    {
        return [
            'seminar_name_english.required' => 'The seminar name in English is required.',
            'seminar_name_english.string' => 'The seminar name in English must be a string.',
            'seminar_name_english.max' => 'The seminar name in English may not be greater than :max characters.',

            'seminar_name_hindi.required' => 'The seminar name in English is required.',
            'seminar_name_hindi.string' => 'The seminar name in English must be a string.',
            'seminar_name_hindi.max' => 'The seminar name in English may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either active or inactive.',
        ];
    }
}
