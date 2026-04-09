<?php

namespace App\Domain\DevoteePromotedLevel\Contracts;

interface DevoteePromotedLevelRepositoryInterface
{
    public function promotedLevelsByLoginId(string $loginId): array;
    public function availableExaminationsByLoginId(string $loginId): array;
    public function shikshaLevelsForDevotee(): array;
}

