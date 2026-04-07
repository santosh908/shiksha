<?php

namespace App\Infrastructure\Report;

use App\Domain\Report\Contracts\ReportRepositoryInterface;
use App\Services\Report\ReportServices;

class LegacyReportRepository implements ReportRepositoryInterface
{
    public function __construct(
        private readonly ReportServices $service
    ) {
    }

    public function allDevotee(): mixed { return $this->service->DevoteeWithALlDetails(); }
    public function nextLevel(): mixed { return $this->service->DevoteeNextExamLevel(); }
}
