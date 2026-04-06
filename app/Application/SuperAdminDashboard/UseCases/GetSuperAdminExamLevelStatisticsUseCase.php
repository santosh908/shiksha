<?php

namespace App\Application\SuperAdminDashboard\UseCases;

use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;

class GetSuperAdminExamLevelStatisticsUseCase
{
    public function __construct(
        private readonly SuperAdminDashboardRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function execute(): array
    {
        return $this->repository->getExamLevelStatistics();
    }
}
