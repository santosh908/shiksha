<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\DevoteeRegistrationStatus;
use Carbon\Carbon;

class StartRegistrationRequest extends FormRequest
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
            'registration_start_date' => 'required|date|after_or_equal:today',
            'registration_end_date' => 'required|date|after:registration_start_date',
            'is_open' => 'required|in:Open,Close',
        ];
    }

    /**
     * Add after-validation checks for overlapping open registrations.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Only check when user is trying to open registration
            if ($this->input('is_open') !== 'Open') {
                return;
            }

            $start = Carbon::parse($this->input('registration_start_date'));
            $end = Carbon::parse($this->input('registration_end_date'));

            // Determine if this is an update and which record to exclude from the conflict check
            $excludeId = null;
            if ($this->route('id')) {
                $excludeId = $this->route('id');
            } elseif ($this->route('registration')) {
                $routeParam = $this->route('registration');
                if (is_object($routeParam) && isset($routeParam->id)) {
                    $excludeId = $routeParam->id;
                } else {
                    $excludeId = $routeParam;
                }
            } elseif ($this->input('id')) {
                $excludeId = $this->input('id');
            }

            // Find any existing registration with is_open = 'Open' that overlaps the given range
            $conflictQuery = DevoteeRegistrationStatus::where('is_open', 'Open');
            if ($excludeId) {
                $conflictQuery->where('id', '!=', $excludeId);
            }
            $conflict = $conflictQuery->where(function ($q) use ($start, $end) {
                $q->whereBetween('registration_start_date', [$start->toDateString(), $end->toDateString()])
                  ->orWhereBetween('registration_end_date', [$start->toDateString(), $end->toDateString()])
                  ->orWhere(function ($q2) use ($start, $end) {
                      $q2->where('registration_start_date', '<', $start->toDateString())
                         ->where('registration_end_date', '>', $end->toDateString());
                  });
            })->exists();

            if ($conflict) {
                $validator->errors()->add('is_open', 'Registration is already open for the given date range.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'registration_start_date.required' => 'Registration start date is required.',
            'registration_start_date.date' => 'Registration start date must be a valid date.',
            'registration_start_date.after_or_equal' => 'Registration start date must be today or later.',
            'registration_end_date.required' => 'Registration end date is required.',
            'registration_end_date.date' => 'Registration end date must be a valid date.',
            'registration_end_date.after' => 'Registration end date must be after start date.',
            'is_open.required' => 'Registration status is required.',
            'is_open.in' => 'Registration status must be either Open or Close.',
        ];
    }
}
