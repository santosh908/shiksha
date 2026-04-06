<?php

namespace App\Application\DevoteeProfileAdmin\Validators;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UpdateSpiritualInfoOneValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(UpdateSpiritualInfoOneData $data): void
    {
        Validator::make($data->toArray(), [
            'profileId' => 'required|integer',
            'userId' => 'required|integer',
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
