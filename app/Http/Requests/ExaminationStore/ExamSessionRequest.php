<?php

namespace App\Http\Requests\ExaminationStore;

use Illuminate\Foundation\Http\FormRequest;

class ExamSessionRequest extends FormRequest
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
            'session_name' => 'required|string|max:255',
            'session_description' => 'required|string|max:2000',
            // 'session_start_date' => [
            //     'required',
            //     'date',
            //     'after_or_equal:today', // Ensures the date is today or in the future
            // ],
        ];
    }
 
public function messages()
{
    return [
        'session_name.required' => 'The session name is required.',
        'session_name.string' => 'The session name must be a valid string.',
        'session_name.max' => 'The session name must not exceed 255 characters.',

        'session_description.required' => 'The session description is required.',
        'session_description.date_format' => 'The session description must be in the format H:i (hours:minutes).',

        'session_start_date.required' => 'The session start date is required.',
        'session_start_date.date' => 'The session start date must be a valid date.',
        'session_start_date.after_or_equal' => 'The session start date must not be a past date.',
    ];
}
}

