<?php

namespace App\Application\DevoteePostRegistration\Validators;

use App\Application\DevoteePostRegistration\DTOs\SaveHearingReadingData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SaveHearingReadingValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(SaveHearingReadingData $data): void
    {
        Validator::make($data->toArray(), [
            'MemorisedPrayers' => 'required|array',
            'MemorisedPrayers.*' => 'integer',
            'Seminar' => 'required|array',
            'Seminar.*' => 'integer',
            'ShastriDegree' => 'required|string|max:255',
        ])->validate();
    }
}
