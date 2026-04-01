<?php

namespace App\Http\Requests\MemorisedprayersStore;

use Illuminate\Foundation\Http\FormRequest;

class MemorisedprayersStoreRequest extends FormRequest
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
            'prayer_name_english' => 'required | string | max:255',
            'prayer_name_hindi' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }

    public function message(): array
    {
        return [
            'prayer_name_english.required' => 'The memorisedprayer name in English is required.',
            'prayer_name_english.string' => 'The memorisedprayer name in English must be a string.',
            'prayer_name_english.max' => 'The memorisedprayer name in English may not be greater than :max characters.',

            'prayer_name_hindi.required' => 'The memorisedprayer name in English is required.',
            'prayer_name_hindi.string' => 'The memorisedprayer name in English must be a string.',
            'prayer_name_hindi.max' => 'The memorisedprayer name in English may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',
        ];
    }

}
