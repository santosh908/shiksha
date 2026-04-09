<?php

namespace App\Infrastructure\DevoteePromotedLevel;

use App\Domain\DevoteePromotedLevel\Contracts\DevoteePromotedLevelRepositoryInterface;
use App\Services\DevoteePromotedLevel\DevoteePromotedLevelServices;
use App\Services\ShikshaLevel\ShikshaLevelServices;

class LegacyDevoteePromotedLevelRepository implements DevoteePromotedLevelRepositoryInterface
{
    public function __construct(
        private readonly DevoteePromotedLevelServices $devoteePromotedLevelServices,
        private readonly ShikshaLevelServices $shikshaLevelServices
    ) {
    }

    public function promotedLevelsByLoginId(string $loginId): array
    {
        return $this->devoteePromotedLevelServices->getDevoteePromotedLevel($loginId);
    }

    public function availableExaminationsByLoginId(string $loginId): array
    {
        return $this->devoteePromotedLevelServices->getDevoteeExamination($loginId);
    }

    public function shikshaLevelsForDevotee(): array
    {
        return $this->shikshaLevelServices->ShikshaLevelListForDevotee();
    }
}

