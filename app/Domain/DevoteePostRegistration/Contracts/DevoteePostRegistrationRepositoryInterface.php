<?php

namespace App\Domain\DevoteePostRegistration\Contracts;

use App\Application\DevoteePostRegistration\DTOs\SaveDevoteeSeminarData;
use App\Application\DevoteePostRegistration\DTOs\SaveHearingReadingData;
use App\Application\DevoteePostRegistration\DTOs\SavePersonalInfoData;
use App\Application\DevoteePostRegistration\DTOs\SaveProfessionalInfoData;

interface DevoteePostRegistrationRepositoryInterface
{
    public function savePersonalInfo(SavePersonalInfoData $payload): mixed;

    public function saveProfessionalInfo(SaveProfessionalInfoData $payload): mixed;

    public function saveHearingReading(SaveHearingReadingData $payload): mixed;

    public function saveDevoteeSeminar(SaveDevoteeSeminarData $payload): mixed;
}
