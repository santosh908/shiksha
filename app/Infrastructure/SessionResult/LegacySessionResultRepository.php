<?php

namespace App\Infrastructure\SessionResult;

use App\Domain\SessionResult\Contracts\SessionResultRepositoryInterface;
use App\Services\SessionResult\SessionResultServices;

class LegacySessionResultRepository implements SessionResultRepositoryInterface
{
    public function __construct(
        private readonly SessionResultServices $service
    ) {
    }

    public function list(?string $session = null): array { return $this->service->getSessionResultList($session); }
    public function listForAshrayLeader(?string $session = null): array { return $this->service->getAsherySessionResultList($session); }
    public function listForBhaktiVriksha(?string $session = null): array { return $this->service->getBhaktiBhikshukSessionResultList($session); }
    public function sessions(): array { return $this->service->ExamSessionList(); }
}
