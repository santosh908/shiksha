<?php

namespace App\Services;

use App\Domain\ResultList\Contracts\ResultListRepositoryInterface;

class ResultListApplicationService
{
    public function __construct(
        private readonly ResultListRepositoryInterface $repository
    ) {
    }

    public function listForSuperAdmin(): array
    {
        return $this->repository->listForSuperAdmin();
    }

    public function listForAshrayLeader(): array
    {
        return $this->repository->listForAshrayLeader();
    }

    public function listForBhaktiVriksha(): array
    {
        return $this->repository->listForBhaktiVriksha();
    }
}

