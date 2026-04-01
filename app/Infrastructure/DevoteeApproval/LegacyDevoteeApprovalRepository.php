<?php

namespace App\Infrastructure\DevoteeApproval;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;
use App\Services\PostRegistraion\PostRegistraionService;

class LegacyDevoteeApprovalRepository implements DevoteeApprovalRepositoryInterface
{
    public function __construct(
        private readonly PostRegistraionService $postRegistrationService
    ) {
    }

    public function getSuperAdminDevoteeList(): array
    {
        return $this->postRegistrationService->DevoteeSuperAdminList();
    }

    public function approveDevoteeByProfileId(int $profileId): mixed
    {
        return $this->postRegistrationService->ApproveDevoteeByLeader($profileId);
    }

    public function rejectDevoteeByProfileId(string $remarks, int $profileId): mixed
    {
        return $this->postRegistrationService->RejectedDevotee($remarks, $profileId);
    }

    public function getEmailByProfessionalId(int $profileId): ?string
    {
        return $this->postRegistrationService->getEmailByProfessionalId($profileId);
    }
}

