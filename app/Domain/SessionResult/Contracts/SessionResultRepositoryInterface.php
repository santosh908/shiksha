<?php

namespace App\Domain\SessionResult\Contracts;

interface SessionResultRepositoryInterface
{
    public function list(?string $session = null): array;
    public function listForAshrayLeader(?string $session = null): array;
    public function listForBhaktiVriksha(?string $session = null): array;
    public function sessions(): array;
}
