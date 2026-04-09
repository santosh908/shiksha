<?php

namespace App\Services\DevoteePromotedLevel;

use App\Services\DevoteePromotedLavel\DevoteePromotedLavelServices;

class DevoteePromotedLevelServices
{
    public function __construct(
        private readonly DevoteePromotedLavelServices $legacyService
    ) {
    }

    public function getDevoteePromotedLevel(string $loginId): array
    {
        return $this->legacyService->getDevoteePromotedLavel($loginId);
    }

    public function getDevoteeExamination(string $loginId): array
    {
        return $this->legacyService->getDevoteeExamination($loginId)->toArray();
    }
}

