<?php

namespace App\Application\DevoteePostRegistration\Validators;

use App\Application\DevoteePostRegistration\DTOs\SaveProfessionalInfoData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SaveProfessionalInfoValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(SaveProfessionalInfoData $data): void
    {
        Validator::make($data->toArray(), [
            'NoOfChant' => 'required|integer|min:0|max:99',
            'ChantingStartDate' => 'required|date|before:today|after_or_equal:1900-01-01',
            'RegulativePrinciples' => 'required|array',
            'RegulativePrinciples.*' => 'integer',
            'BooksRead' => 'required|array',
            'BooksRead.*' => 'integer',
            'SpendTimeHearingLecture' => 'required|string|max:255',
        ])->validate();
    }
}
