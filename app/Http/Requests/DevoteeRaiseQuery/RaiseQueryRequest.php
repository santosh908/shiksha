<?php

namespace App\Http\Requests\DevoteeRaiseQuery;

use App\Models\User;
use App\Models\RaiseQuery\RaiseQuery;
use Illuminate\Foundation\Http\FormRequest;

class RaiseQueryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'raisequery' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'raisequery.required' => 'The query field is required.',
            'raisequery.string' => 'The query must be a string.',
            'raisequery.max' => 'The query may not be greater than 255 characters.',
        ];
    }
}
