<?php

namespace App\Application\DevoteeProfileAdmin\Validators;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UpdateSpiritualInfoThreeValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(UpdateSpiritualInfoThreeData $data): void
    {
        Validator::make($data->toArray(), [
            'profileId' => 'required|integer',
            'userId' => 'required|integer',
            'ashray_leader_code' => 'required|integer',
            'Bhakti_BhikshukId' => 'nullable|integer|min:0',
            'since_when_you_attending_ashray_classes' => 'required|date|before_or_equal:today|after_or_equal:1900-01-01',
            'spiritual_master_you_aspiring' => 'required|string|max:255',
        ])->validate();
    }
}
