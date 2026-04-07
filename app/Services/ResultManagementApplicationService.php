<?php

namespace App\Services;

use App\Domain\ResultManagement\Contracts\ResultManagementRepositoryInterface;

class ResultManagementApplicationService
{
    public function __construct(
        private readonly ResultManagementRepositoryInterface $repository
    ) {
    }

    public function listForSuperAdmin(): array { return $this->repository->listForSuperAdmin(); }
    public function listForAshrayLeader(): array { return $this->repository->listForAshrayLeader(); }
    public function listForBhaktiVriksha(): array { return $this->repository->listForBhaktiVriksha(); }
    public function allowPrevent(mixed $payload): mixed { return $this->repository->allowPrevent($payload); }
    public function publish(mixed $payload): mixed { return $this->repository->publish($payload); }
    public function examList(): array { return $this->repository->examList(); }
    public function levelList(): array { return $this->repository->levelList(); }
    public function uploadOffline(mixed $file, mixed $levelId, mixed $examId): mixed
    {
        return $this->repository->uploadOffline($file, $levelId, $examId);
    }
}
