<?php

namespace App\Application\SuperAdminDashboard\UseCases;

use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;

class GetSuperAdminDashboardCountsUseCase
{
    public function __construct(
        private readonly SuperAdminDashboardRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<string, int>
     */
    public function execute(): array
    {
        return $this->repository->getDashboardCounts();
    }
}
