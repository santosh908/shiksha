<?php

namespace App\Services;

use App\Application\AsheryLeaderDashboard\DTOs\AsheryLeaderDashboardCountsData;
use App\Domain\AsheryLeaderDashboard\Contracts\AsheryLeaderDashboardRepositoryInterface;

class AsheryLeaderDashboardApplicationService
{
    public function __construct(
        private readonly AsheryLeaderDashboardRepositoryInterface $repository
    ) {
    }

    public function countsByUserId(int $userId): AsheryLeaderDashboardCountsData
    {
        $counts = $this->repository->countsByUserId($userId);
        return AsheryLeaderDashboardCountsData::fromArray($counts);
    }
}

