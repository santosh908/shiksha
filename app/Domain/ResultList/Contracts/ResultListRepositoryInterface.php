<?php

namespace App\Domain\ResultList\Contracts;

interface ResultListRepositoryInterface
{
    public function listForSuperAdmin(): array;
    public function listForAshrayLeader(): array;
    public function listForBhaktiVriksha(): array;
}

