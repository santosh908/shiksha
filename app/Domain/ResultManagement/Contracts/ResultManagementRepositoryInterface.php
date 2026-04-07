<?php

namespace App\Domain\ResultManagement\Contracts;

interface ResultManagementRepositoryInterface
{
    public function listForSuperAdmin(): array;
    public function listForAshrayLeader(): array;
    public function listForBhaktiVriksha(): array;
    public function allowPrevent(mixed $payload): mixed;
    public function publish(mixed $payload): mixed;
    public function examList(): array;
    public function levelList(): array;
    public function uploadOffline(mixed $file, mixed $levelId, mixed $examId): mixed;
}
