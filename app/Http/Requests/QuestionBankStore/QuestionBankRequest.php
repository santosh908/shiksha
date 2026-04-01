<?php

namespace App\Http\Requests\QuestionBankStore;

use Illuminate\Foundation\Http\FormRequest;

class QuestionBankRequest extends FormRequest
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
            'question_english' => 'required | string',
            'question_hindi' => 'required | string',
            'subject_id' => 'required | string | max:255',
            'chapter_id' => 'required | string | max:255',
            'level_id' => 'required | string | max:255',
            'difficulty_label' => 'required | string | max:255',
            'option1' => 'required | string | max:255',
            'option2' => 'required | string | max:255',
            'option3' => 'required | string | max:255',
            'option4' => 'required | string | max:255',
            'correctanswer' => 'required | string | max:255',
            //'any_remark'=> 'required | string | max:255',
            'is_active' => 'required',
        ];
    }

    public function message(): array
    {
        return [
            'question_english.required' => 'The English question field is required.',
            'question_english.string' => 'The English question must be a string.',
            'question_hindi.required' => 'The Hindi question field is required.',
            'question_hindi.string' => 'The Hindi question must be a string.',
            'subject_id.required' => 'The subject field is required.',
            'subject_id.string' => 'The subject must be a string.',
            'subject_id.max' => 'The subject may not be greater than 255 characters.',

            'chapter_id.required' => 'The chapter field is required.',
            'chapter_id.string' => 'The chapter must be a string.',
            'chapter_id.max' => 'The chapter may not be greater than 255 characters.',

            'level_id.required' => 'The level field is required.',
            'level_id.string' => 'The level must be a string.',
            'level_id.max' => 'The level may not be greater than 255 characters.',

            'difficulty_label.required' => 'The difficulty label field is required.',
            'difficulty_label.string' => 'The difficulty label must be a string.',
            'difficulty_label.max' => 'The difficulty label may not be greater than 255 characters.',

            'option1.required' => 'Option 1 is required.',
            'option1.string' => 'Option 1 must be a string.',
            'option1.max' => 'Option 1 may not be greater than 255 characters.',

            'option2.required' => 'Option 2 is required.',
            'option2.string' => 'Option 2 must be a string.',
            'option2.max' => 'Option 2 may not be greater than 255 characters.',

            'option3.required' => 'Option 3 is required.',
            'option3.string' => 'Option 3 must be a string.',
            'option3.max' => 'Option 3 may not be greater than 255 characters.',

            'option4.required' => 'Option 4 is required.',
            'option4.string' => 'Option 4 must be a string.',
            'option4.max' => 'Option 4 may not be greater than 255 characters.',

            'correctanswer.required' => 'The correct answer field is required.',
            'correctanswer.string' => 'The correct answer must be a string.',
            'correctanswer.max' => 'The correct answer may not be greater than 255 characters.',

            'any_remark.required' => 'Any remark field is required.',
            'any_remark.string' => 'Any remark must be a string.',
            'any_remark.max' => 'Any remark may not be greater than 255 characters.',

            'is_active.required' => 'The active status field is required.',
            'is_active.string' => 'The active status must be a string.',
            'is_active.max' => 'The active status may not be greater than 255 characters.',
        ];
    }
}
