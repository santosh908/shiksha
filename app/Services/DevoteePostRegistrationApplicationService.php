<?php

namespace App\Services;

use App\Application\DevoteePostRegistration\DTOs\SaveDevoteeSeminarData;
use App\Application\DevoteePostRegistration\DTOs\SaveHearingReadingData;
use App\Application\DevoteePostRegistration\DTOs\SavePersonalInfoData;
use App\Application\DevoteePostRegistration\DTOs\SaveProfessionalInfoData;
use App\Application\DevoteePostRegistration\UseCases\SaveDevoteeSeminarUseCase;
use App\Application\DevoteePostRegistration\UseCases\SaveHearingReadingUseCase;
use App\Application\DevoteePostRegistration\UseCases\SavePersonalInfoUseCase;
use App\Application\DevoteePostRegistration\UseCases\SaveProfessionalInfoUseCase;

class DevoteePostRegistrationApplicationService
{
    public function __construct(
        private readonly SavePersonalInfoUseCase $savePersonalInfoUseCase,
        private readonly SaveProfessionalInfoUseCase $saveProfessionalInfoUseCase,
        private readonly SaveHearingReadingUseCase $saveHearingReadingUseCase,
        private readonly SaveDevoteeSeminarUseCase $saveDevoteeSeminarUseCase
    ) {
    }

    public function savePersonalInfo(SavePersonalInfoData $payload): mixed
    {
        return $this->savePersonalInfoUseCase->execute($payload);
    }

    public function saveProfessionalInfo(SaveProfessionalInfoData $payload): mixed
    {
        return $this->saveProfessionalInfoUseCase->execute($payload);
    }

    public function saveHearingReading(SaveHearingReadingData $payload): mixed
    {
        return $this->saveHearingReadingUseCase->execute($payload);
    }

    public function saveDevoteeSeminar(SaveDevoteeSeminarData $payload): mixed
    {
        return $this->saveDevoteeSeminarUseCase->execute($payload);
    }
}
