<?php

namespace App\Services;

use App\Domain\SessionResult\Contracts\SessionResultRepositoryInterface;

class SessionResultApplicationService
{
    public function __construct(
        private readonly SessionResultRepositoryInterface $repository
    ) {
    }

    public function list(?string $session = null): array { return $this->repository->list($session); }
    public function listForAshrayLeader(?string $session = null): array { return $this->repository->listForAshrayLeader($session); }
    public function listForBhaktiVriksha(?string $session = null): array { return $this->repository->listForBhaktiVriksha($session); }
    public function sessions(): array { return $this->repository->sessions(); }
}
