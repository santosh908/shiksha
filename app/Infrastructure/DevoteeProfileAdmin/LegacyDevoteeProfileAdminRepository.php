<?php

namespace App\Infrastructure\DevoteeProfileAdmin;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;
use Illuminate\Http\Request;
use App\Services\PostRegistraion\PostRegistraionService;

class LegacyDevoteeProfileAdminRepository implements DevoteeProfileAdminRepositoryInterface
{
    public function __construct(
        private readonly PostRegistraionService $postRegistrationService
    ) {
    }

    public function getDevoteeDetails(int $userId): array
    {
        return $this->postRegistrationService->getDevoteeDtails($userId);
    }

    public function getPartialDevoteeDetails(int $userId): array
    {
        return $this->postRegistrationService->getPartiallDevoteeDtails($userId);
    }

    public function updatePersonalInfo(UpdatePersonalInfoData $payload): mixed
    {
        return $this->postRegistrationService->SuperAdminUpdatePersonalInfo(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function updateSpiritualInfoOne(UpdateSpiritualInfoOneData $payload): mixed
    {
        return $this->postRegistrationService->SuperAdminUpdateSpritualInfoOne(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function updateSpiritualInfoTwo(UpdateSpiritualInfoTwoData $payload): mixed
    {
        return $this->postRegistrationService->SuperAdminUpdateSpritualInfoTwo(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function updateSpiritualInfoThree(UpdateSpiritualInfoThreeData $payload): mixed
    {
        return $this->postRegistrationService->SuperAdminUpdateSpritualInfoThree(
            Request::create('/', 'POST', $payload->toArray())
        );
    }
}
