<?php

namespace App\Http\Requests\AnnouncementStore;

use Illuminate\Foundation\Http\FormRequest;

class AnnouncementRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'valid_upto' => 'required|date',
            'display_sequence' => 'required|integer|min:1',
            'is_active' => 'required|string|in:Y,N',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Ensure description HTML is preserved
        if ($this->has('description')) {
            $this->merge([
                'description' => $this->input('description'),
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.string' => 'The title must be a string.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'description.required' => 'The description is required.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'valid_upto.required' => 'The valid upto date is required.',
            'valid_upto.date' => 'The valid upto must be a valid date.',
            'is_active.required' => 'The status is required.',
            'is_active.in' => 'The status must be either Y or N.',
            'display_sequence.required' => 'Please enter a display sequence.',
            'display_sequence.integer' => 'Display sequence must be a valid number.',
            'display_sequence.min' => 'Display sequence must be greater than 0.',
        ];
    }
}
