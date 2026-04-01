<?php

namespace App\Http\Requests\ProfessionStore;

use Illuminate\Foundation\Http\FormRequest;

class ProfessionStoreRequest extends FormRequest
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
            'profession_name' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }
    public function messages(): array
    {
        return [
            'profession_name.required' => 'The profession status name in English is required.',
            'profession_name.string' => 'The profession status name in English must be a string.',
            'profession_name.max' => 'The profession status name in English may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either active or inactive.',
        ];
    }
}
