<?php

namespace App\Application\SuperAdminDashboard\UseCases;

use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;

class GetQualifiedUsersForLevelUseCase
{
    public function __construct(
        private readonly SuperAdminDashboardRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function execute(int|string|null $level = null): array
    {
        return $this->repository->getQualifiedUsersForLevel($level);
    }
}
