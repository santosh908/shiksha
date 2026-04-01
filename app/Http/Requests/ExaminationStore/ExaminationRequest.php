<?php

namespace App\Http\Requests\ExaminationStore;

use Illuminate\Foundation\Http\FormRequest;

class ExaminationRequest extends FormRequest
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
            'exam_session_id' => 'required|string|max:255',
             'exam_level_id' => 'required|string|max:255',
             'date' => 'required|date', // Ensures the date is today or later |after_or_equal:today
             'start_time' => 'required|date_format:H:i',
             'duration' => 'required|integer|min:0|max:999',
             'no_of_question' => 'required|integer|min:0|max:999',
             'total_marks' => 'required|integer|min:0|max:999',
             'qualifying_marks' => 'required|integer|min:0|max:999',
             'is_active' => 'required|in:Y,N,y,n',
            //  'date' => [
            //     'required',
            //     'date',
            //     function ($attribute, $value, $fail) {
            //         $exam = $this->route('examination'); // Now correctly resolves the model instance

            //         if ($exam && $value !== $exam->date && $value < now()->format('Y-m-d')) {
            //             $fail('The session start date must not be in the past if changed.');
            //         }
            //     },
            // ],
        ];
    }
 
    public function messages()
    {
        return [
            'exam_session_id.required' => 'The session name is required.',
            'exam_session_id.string' => 'The session name must be a string.',
            'exam_session_id.max' => 'The session name may not exceed 255 characters.',
    
            'exam_level_id.required' => 'The exam name is required.',
            'exam_level_id.string' => 'The exam name must be a string.',
            'exam_level_id.max' => 'The exam name may not exceed 255 characters.',
    
            'date.required' => 'The exam date is required.',
            'date.date' => 'The exam date must be a valid date.',
            'date.after_or_equal' => 'The exam date cannot be in the past.', // Custom message for date rule
    
            'start_time.required' => 'The start time is required.',
            'start_time.date_format' => 'The start time must be in the format HH:mm.',
    
            'duration.required' => 'The duration is required.',
            'duration.integer' => 'The duration must be an integer.',
            'duration.min' => 'The duration must be at least 1 minute.',
            'duration.max' => 'The duration may not exceed 999 minutes.',
    
            'no_of_question.required' => 'The number of questions is required.',
            'no_of_question.integer' => 'The number of questions must be an integer.',
            'no_of_question.min' => 'There must be at least 1 question.',
            'no_of_question.max' => 'The number of questions may not exceed 999.',
    
            'total_marks.required' => 'The total marks are required.',
            'total_marks.integer' => 'The total marks must be an integer.',
            'total_marks.min' => 'The total marks must be at least 1.',
            'total_marks.max' => 'The total marks may not exceed 999.',
    
            'qualifying_marks.required' => 'The qualifying marks are required.',
            'qualifying_marks.integer' => 'The qualifying marks must be an integer.',
            'qualifying_marks.min' => 'The qualifying marks must be at least 1.',
            'qualifying_marks.max' => 'The qualifying marks may not exceed 999.',
    
            'is_active.required' => 'The active status is required.',
            'is_active.boolean' => 'The active status must be true or false.',
        ];
    }
}

