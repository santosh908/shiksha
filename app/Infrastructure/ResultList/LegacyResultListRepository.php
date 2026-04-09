<?php

namespace App\Infrastructure\ResultList;

use App\Domain\ResultList\Contracts\ResultListRepositoryInterface;
use App\Services\DevoteeResultList\DevoteeResultListServices;

class LegacyResultListRepository implements ResultListRepositoryInterface
{
    public function __construct(
        private readonly DevoteeResultListServices $service
    ) {
    }

    public function listForSuperAdmin(): array
    {
        return $this->service->getDevoteeResultList();
    }

    public function listForAshrayLeader(): array
    {
        return $this->service->getAsheryDevoteeResultList();
    }

    public function listForBhaktiVriksha(): array
    {
        return $this->service->getBhaktiBhikshukDevoteeResultList();
    }
}

