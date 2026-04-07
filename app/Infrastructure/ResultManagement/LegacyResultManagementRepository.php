<?php

namespace App\Infrastructure\ResultManagement;

use App\Domain\ResultManagement\Contracts\ResultManagementRepositoryInterface;
use App\Services\DevoteeResultList\DevoteeResultListServices;

class LegacyResultManagementRepository implements ResultManagementRepositoryInterface
{
    public function __construct(
        private readonly DevoteeResultListServices $service
    ) {
    }

    public function listForSuperAdmin(): array { return $this->service->getDevoteeResultList(); }
    public function listForAshrayLeader(): array { return $this->service->getAsheryDevoteeResultList(); }
    public function listForBhaktiVriksha(): array { return $this->service->getBhaktiBhikshukDevoteeResultList(); }
    public function allowPrevent(mixed $payload): mixed { return $this->service->resultAloowPrevent($payload); }
    public function publish(mixed $payload): mixed { return $this->service->addPublishResult($payload); }
    public function examList(): array { return $this->service->Examination(); }
    public function levelList(): array { return $this->service->ShikshaLevel(); }
    public function uploadOffline(mixed $file, mixed $levelId, mixed $examId): mixed
    {
        return $this->service->UploadOfflineMarksExamResult($file, $levelId, $examId);
    }
}
