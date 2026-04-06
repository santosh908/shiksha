<?php

namespace App\Services;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;
use App\Application\DevoteeProfileAdmin\UseCases\GetDevoteeDetailsForAdminUseCase;
use App\Application\DevoteeProfileAdmin\UseCases\GetPartialDevoteeDetailsForAdminUseCase;
use App\Application\DevoteeProfileAdmin\UseCases\UpdateDevoteePersonalInfoUseCase;
use App\Application\DevoteeProfileAdmin\UseCases\UpdateDevoteeSpiritualInfoOneUseCase;
use App\Application\DevoteeProfileAdmin\UseCases\UpdateDevoteeSpiritualInfoThreeUseCase;
use App\Application\DevoteeProfileAdmin\UseCases\UpdateDevoteeSpiritualInfoTwoUseCase;

class DevoteeProfileAdminApplicationService
{
    public function __construct(
        private readonly GetDevoteeDetailsForAdminUseCase $getDevoteeDetailsForAdminUseCase,
        private readonly GetPartialDevoteeDetailsForAdminUseCase $getPartialDevoteeDetailsForAdminUseCase,
        private readonly UpdateDevoteePersonalInfoUseCase $updateDevoteePersonalInfoUseCase,
        private readonly UpdateDevoteeSpiritualInfoOneUseCase $updateDevoteeSpiritualInfoOneUseCase,
        private readonly UpdateDevoteeSpiritualInfoTwoUseCase $updateDevoteeSpiritualInfoTwoUseCase,
        private readonly UpdateDevoteeSpiritualInfoThreeUseCase $updateDevoteeSpiritualInfoThreeUseCase,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function getDevoteeDetails(int $userId): array
    {
        return $this->getDevoteeDetailsForAdminUseCase->execute($userId);
    }

    /**
     * @return array<string, mixed>
     */
    public function getPartialDevoteeDetails(int $userId): array
    {
        return $this->getPartialDevoteeDetailsForAdminUseCase->execute($userId);
    }

    public function updatePersonalInfo(UpdatePersonalInfoData $payload): mixed
    {
        return $this->updateDevoteePersonalInfoUseCase->execute($payload);
    }

    public function updateSpiritualInfoOne(UpdateSpiritualInfoOneData $payload): mixed
    {
        return $this->updateDevoteeSpiritualInfoOneUseCase->execute($payload);
    }

    public function updateSpiritualInfoTwo(UpdateSpiritualInfoTwoData $payload): mixed
    {
        return $this->updateDevoteeSpiritualInfoTwoUseCase->execute($payload);
    }

    public function updateSpiritualInfoThree(UpdateSpiritualInfoThreeData $payload): mixed
    {
        return $this->updateDevoteeSpiritualInfoThreeUseCase->execute($payload);
    }
}
