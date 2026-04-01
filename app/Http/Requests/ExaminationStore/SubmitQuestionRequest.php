<?php

namespace App\Http\Requests\ExaminationStore;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuestionRequest extends FormRequest
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
            'examId' => 'required|integer',
            'examLevelId' => 'required|integer',
            'sessionId' => 'required|integer',
            'questionId' => 'required|integer',
            'selectedAnswer' => 'required|string',
        ];
    }
 
    public function messages()
    {
        return [
            'examId.required' => 'The exam ID is required.',
            'examId.integer' => 'The exam ID must be an integer.',

            'examLevelId.required' => 'The exam level ID is required.',
            'examLevelId.integer' => 'The exam level ID must be an integer.',

            'sessionId.required' => 'The session ID is required.',
            'sessionId.integer' => 'The session ID must be an integer.',

            'questionId.required' => 'The question ID is required.',
            'questionId.integer' => 'The question ID must be an integer.',

            'selectedAnswer.required' => 'The selected answer is required.',
            'selectedAnswer.string' => 'The selected answer must be a string.',
        ];
    }
}

