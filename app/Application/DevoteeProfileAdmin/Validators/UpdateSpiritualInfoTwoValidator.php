<?php

namespace App\Application\DevoteeProfileAdmin\Validators;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UpdateSpiritualInfoTwoValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(UpdateSpiritualInfoTwoData $data): void
    {
        Validator::make($data->toArray(), [
            'profileId' => 'required|integer',
            'MemorisedPrayers' => 'required|array',
            'MemorisedPrayers.*' => 'integer',
            'Seminar' => 'required|array',
            'Seminar.*' => 'integer',
            'ShastriDegree' => 'required|string|max:255',
        ])->validate();
    }
}
