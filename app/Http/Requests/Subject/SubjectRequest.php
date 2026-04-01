<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;
class SubjectRequest extends FormRequest
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
            'shiksha_level_id' => 'required|exists:shiksha_levels,id',
            'subject_name' => 'required | string | max:255',
            'is_active' => 'required',
        ];
    }
    public function message(): array
    {
        return [
            'shiksha_level_id.required' => 'The Shiksha Level is required.',

            'subject_name.required' => 'The Subject name is required.',
            'subject_name.string' => 'The Subject name  must be a string.',
            'subject_name.max' => 'The Subject name may not be greater than :max characters.',

            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',
        ];
    }
}
