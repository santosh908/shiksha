<?php

namespace App\Http\Requests\BookStore;

use Illuminate\Foundation\Http\FormRequest;

class BookStoreRequest extends FormRequest
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
            'book_name_english' => 'required | string | max:255',
            'book_name_hindi' => 'required | string | max:255',
            'is_active' => 'required',

        ];
    }
    public function message(): array
    {
        return [
            'book_name_english.required' => 'The book name in English is required.',
            'book_name_english.string' => 'The book name in English must be a string.',
            'book_name_english.max' => 'The book name in English may not be greater than :max characters.',

            'book_name_hindi.required' => 'The book name in Hindi is required.',
            'book_name_hindi.string' => 'The book name in Hindi must be a string.',
            'book_name_hindi.max' => 'The book name in Hindi may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',
        ];
    }
}
