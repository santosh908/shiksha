<?php

namespace App\Http\Requests\Chapter;

use Illuminate\Foundation\Http\FormRequest;
class ChapterRequest extends FormRequest
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
            'subject_id' => 'required|exists:subjects,id',
            'chapter_name' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }

    public function message(): array
    {
        return [
            'subject_id.required' => 'The Subject is required.',

            'chapter_name.required' => 'The Chapter name is required.',
            'chapter_name.string' => 'The Chapter name  must be a string.',
            'chapter_name.max' => 'The Chapter name may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',
        ];
    }
}
