<?php

namespace App\Services;

use App\Domain\DevoteePromotedLevel\Contracts\DevoteePromotedLevelRepositoryInterface;

class DevoteePromotedLevelApplicationService
{
    public function __construct(
        private readonly DevoteePromotedLevelRepositoryInterface $repository
    ) {
    }

    public function promotedLevelsByLoginId(string $loginId): array
    {
        return $this->repository->promotedLevelsByLoginId($loginId);
    }

    public function availableExaminationsByLoginId(string $loginId): array
    {
        return $this->repository->availableExaminationsByLoginId($loginId);
    }

    public function shikshaLevelsForDevotee(): array
    {
        return $this->repository->shikshaLevelsForDevotee();
    }
}

