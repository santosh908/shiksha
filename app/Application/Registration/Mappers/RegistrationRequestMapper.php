<?php

namespace App\Application\Registration\Mappers;

use App\Application\Registration\DTOs\CompleteRegistrationData;

class RegistrationRequestMapper
{
    public function toCompleteRegistrationData(array $validated): CompleteRegistrationData
    {
        return CompleteRegistrationData::fromArray($validated);
    }
}

