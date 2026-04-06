<?php

namespace App\Domain\SuperAdminDashboard\Contracts;

interface SuperAdminDashboardRepositoryInterface
{
    /**
     * @return array<string, int>
     */
    public function getDashboardCounts(): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getExamLevelStatistics(): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getQualifiedUsersForLevel(int|string|null $level = null): array;
}
