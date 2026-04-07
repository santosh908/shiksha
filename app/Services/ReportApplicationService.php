<?php

namespace App\Services;

use App\Domain\Report\Contracts\ReportRepositoryInterface;

class ReportApplicationService
{
    public function __construct(
        private readonly ReportRepositoryInterface $repository
    ) {
    }

    public function allDevotee(): mixed { return $this->repository->allDevotee(); }
    public function nextLevel(): mixed { return $this->repository->nextLevel(); }
}
