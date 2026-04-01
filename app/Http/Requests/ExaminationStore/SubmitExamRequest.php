<?php

namespace App\Http\Requests\ExaminationStore;

use Illuminate\Foundation\Http\FormRequest;

class SubmitExamRequest extends FormRequest
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
            'submissionList' => 'required|array',
            'submissionList.*.examId' => 'required|integer',
            'submissionList.*.examLevelId' => 'required|integer',
            'submissionList.*.sessionId' => 'required|integer',
            'submissionList.*.selectedAnswer' => 'required|string',
        ];
    }
 
    public function messages()
    {
        return [
            'submissionList.required' => 'The submission list is required.',
            'submissionList.*.examId.required' => 'The exam ID is required for each submission.',
            'submissionList.*.examLevelId.required' => 'The exam level ID is required for each submission.',
            'submissionList.*.sessionId.required' => 'The session ID is required for each submission.',
            'submissionList.*.question.required' => 'The question text is required for each submission.',
            'submissionList.*.selectedAnswer.required' => 'The selected answer is required for each submission.',
        ];
    }
}

