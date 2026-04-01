<?php

namespace App\Http\Requests\Devotee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class StoreDevoteeSeminar extends FormRequest
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
            'ashray_leader_code' => 'required|integer',
            // 'other_ashry_leader_name' => 'required|string|max:255',
            'since_when_you_attending_ashray_classes' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $date = Carbon::parse($value);

                    // Check if the date is in the future
                    if ($date->isFuture()) {
                        $fail('The date cannot be in the future.');
                    }

                    // Ensure the date is on or after January 1, 1900
                    if ($date->lt(Carbon::createFromFormat('Y-m-d', '1900-01-01'))) {
                        $fail('The date must be on or after January 1, 1900.');
                    }
                },
            ],
            'spiritual_master_you_aspiring' => 'required|string|max:255',
            //'attend_shray_classes_in_temple' => 'required|string|max:255',
        ];
    }
    public function messages(): array
    {
        return [
            'ashray_leader.required' => 'The Ashray leader field is required.',
            'ashray_leader.integer' => 'The Ashray leader must be an integer.',
            'other_ashry_leader_name.required' => 'Please provide the name of the other Ashray leader.',
            'since_when_you_attending_ashray_classes.required' => 'Please specify since when you have been attending Ashray classes.',
            'since_when_you_attending_ashray_classes.date' => 'The date format is incorrect.',
            'since_when_you_attending_ashray_classes.before_or_equal' => 'The date cannot be in the future.',
            'since_when_you_attending_ashray_classes.after_or_equal' => 'The date must be on or after January 1, 1900.',
            'spiritual_master_you_aspiring.required' => 'Please provide the name of the spiritual master you are aspiring to.',
            'attend_shray_classes_in_temple.required' => 'Please specify if you attend Ashray classes in the temple.',
        ];
    }
}
