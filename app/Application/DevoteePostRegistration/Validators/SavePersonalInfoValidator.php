<?php

namespace App\Application\DevoteePostRegistration\Validators;

use App\Application\DevoteePostRegistration\DTOs\SavePersonalInfoData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SavePersonalInfoValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(SavePersonalInfoData $data): void
    {
        Validator::make($data->toArray(), [
            'Educational' => 'required|string|max:255',
            'MaritalStatus' => 'required|string|max:10',
            'Profession' => 'required|string|max:10',
            'JoinedSckon' => 'required|date|before:today|after_or_equal:1900-01-01',
            'CurrentAddress' => 'required|string|max:255',
            'Socity_Name' => 'required|string|max:255',
            'Sector_Area' => 'required|string|max:255',
            'Pincode' => 'required|string|max:6|min:6',
            'State' => 'required|string|max:10',
            'District' => 'required|string|max:10',
        ])->validate();
    }
}
