<?php

namespace App\Domain\AsheryLeaderDashboard\Contracts;

interface AsheryLeaderDashboardRepositoryInterface
{
    /**
     * @return array{bhaktiBhishukCount:int,partiallydevoteeCount:int,approvedevoteeCount:int,notapprovedevoteeCount:int}
     */
    public function countsByUserId(int $userId): array;
}

