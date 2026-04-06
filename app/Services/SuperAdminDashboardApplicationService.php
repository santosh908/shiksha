<?php

namespace App\Services;

use App\Application\SuperAdminDashboard\UseCases\GetQualifiedUsersForLevelUseCase;
use App\Application\SuperAdminDashboard\UseCases\GetSuperAdminDashboardCountsUseCase;
use App\Application\SuperAdminDashboard\UseCases\GetSuperAdminExamLevelStatisticsUseCase;

class SuperAdminDashboardApplicationService
{
    public function __construct(
        private readonly GetSuperAdminDashboardCountsUseCase $getSuperAdminDashboardCountsUseCase,
        private readonly GetSuperAdminExamLevelStatisticsUseCase $getSuperAdminExamLevelStatisticsUseCase,
        private readonly GetQualifiedUsersForLevelUseCase $getQualifiedUsersForLevelUseCase,
    ) {
    }

    /**
     * @return array<string, int>
     */
    public function getDashboardCounts(): array
    {
        return $this->getSuperAdminDashboardCountsUseCase->execute();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getExamLevelStatistics(): array
    {
        return $this->getSuperAdminExamLevelStatisticsUseCase->execute();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getQualifiedUsersForLevel(int|string|null $level = null): array
    {
        return $this->getQualifiedUsersForLevelUseCase->execute($level);
    }
}
