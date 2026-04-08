<?php

namespace App\Application\AsheryLeaderDashboard\DTOs;

class AsheryLeaderDashboardCountsData
{
    public function __construct(
        public readonly int $bhaktiBhishukCount,
        public readonly int $partiallydevoteeCount,
        public readonly int $approvedevoteeCount,
        public readonly int $notapprovedevoteeCount,
    ) {
    }

    /**
     * @param array{bhaktiBhishukCount:int,partiallydevoteeCount:int,approvedevoteeCount:int,notapprovedevoteeCount:int} $counts
     */
    public static function fromArray(array $counts): self
    {
        return new self(
            bhaktiBhishukCount: (int) ($counts['bhaktiBhishukCount'] ?? 0),
            partiallydevoteeCount: (int) ($counts['partiallydevoteeCount'] ?? 0),
            approvedevoteeCount: (int) ($counts['approvedevoteeCount'] ?? 0),
            notapprovedevoteeCount: (int) ($counts['notapprovedevoteeCount'] ?? 0),
        );
    }
}

