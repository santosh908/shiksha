<?php

namespace App\Http\Requests\DevoteeRaiseQuery;

use Illuminate\Foundation\Http\FormRequest;

class Devoteeraisequeryrequest extends FormRequest
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
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'subject.required' => 'The subject field is required.',
            'subject.string' => 'The subject must be a string.',
            'subject.max' => 'The subject may not be greater than 255 characters.',

            'description.required' => 'The query field is required.',
            'description.string' => 'The query must be a string.',
            'description.max' => 'The query may not be greater than 255 characters.',
        ];
    }
}
