<?php

namespace App\Domain\DevoteeProfileAdmin\Contracts;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;

interface DevoteeProfileAdminRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getDevoteeDetails(int $userId): array;

    /**
     * @return array<string, mixed>
     */
    public function getPartialDevoteeDetails(int $userId): array;

    public function updatePersonalInfo(UpdatePersonalInfoData $payload): mixed;

    public function updateSpiritualInfoOne(UpdateSpiritualInfoOneData $payload): mixed;

    public function updateSpiritualInfoTwo(UpdateSpiritualInfoTwoData $payload): mixed;

    public function updateSpiritualInfoThree(UpdateSpiritualInfoThreeData $payload): mixed;
}
