<?php

namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;

class SendLinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'email' => 'required | string |email| max:255',
        ];
    }

    public function message(): array
    {
        return [
           'email.required' => 'The email field is required.',
            'email.string' => 'The email must be a valid string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'The email must not exceed 255 characters.',
        ];
    }
}
