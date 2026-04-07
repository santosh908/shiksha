<?php

namespace App\Infrastructure\DevoteePostRegistration;

use App\Application\DevoteePostRegistration\DTOs\SaveDevoteeSeminarData;
use App\Application\DevoteePostRegistration\DTOs\SaveHearingReadingData;
use App\Application\DevoteePostRegistration\DTOs\SavePersonalInfoData;
use App\Application\DevoteePostRegistration\DTOs\SaveProfessionalInfoData;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;
use App\Services\PostRegistraion\PostRegistraionService;
use Illuminate\Http\Request;

class LegacyDevoteePostRegistrationRepository implements DevoteePostRegistrationRepositoryInterface
{
    public function __construct(
        private readonly PostRegistraionService $postRegistrationService
    ) {
    }

    public function savePersonalInfo(SavePersonalInfoData $payload): mixed
    {
        return $this->postRegistrationService->SavePersonalInfo(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function saveProfessionalInfo(SaveProfessionalInfoData $payload): mixed
    {
        return $this->postRegistrationService->SaveProfessionalInfo(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function saveHearingReading(SaveHearingReadingData $payload): mixed
    {
        return $this->postRegistrationService->SaveHearingReading(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function saveDevoteeSeminar(SaveDevoteeSeminarData $payload): mixed
    {
        return $this->postRegistrationService->SaveDevoteeSeminar(
            Request::create('/', 'POST', $payload->toArray())
        );
    }
}
