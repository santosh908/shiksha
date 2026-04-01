<?php

namespace App\Http\Requests\MeritalStatuStore;

use Illuminate\Foundation\Http\FormRequest;

class MeritalStatusRequest extends FormRequest
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
            'merital_status_name' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }

    public function message(): array
    {
        return [
            'merital_status_name.required' => 'The merital status name in English is required.',
            'merital_status_name.string' => 'The merital status name in English must be a string.',
            'merital_status_name.max' => 'The merital status name in English may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either active or inactive.',
        ];
    }
}
