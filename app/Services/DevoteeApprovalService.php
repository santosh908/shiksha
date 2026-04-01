<?php

namespace App\Services;

use App\Application\DevoteeApproval\UseCases\ApproveDevoteeUseCase;
use App\Application\DevoteeApproval\UseCases\GetSuperAdminDevoteeListUseCase;
use App\Application\DevoteeApproval\UseCases\RejectDevoteeUseCase;
use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

class DevoteeApprovalService
{
    public function __construct(
        private readonly GetSuperAdminDevoteeListUseCase $getSuperAdminDevoteeListUseCase,
        private readonly ApproveDevoteeUseCase $approveDevoteeUseCase,
        private readonly RejectDevoteeUseCase $rejectDevoteeUseCase,
        private readonly DevoteeApprovalRepositoryInterface $repository
    ) {
    }

    public function getSuperAdminDevoteeList(): array
    {
        return $this->getSuperAdminDevoteeListUseCase->execute();
    }

    public function approveDevotee(int $profileId): mixed
    {
        return $this->approveDevoteeUseCase->execute($profileId);
    }

    public function rejectDevotee(string $remarks, int $profileId): mixed
    {
        return $this->rejectDevoteeUseCase->execute($remarks, $profileId);
    }

    public function getEmailByProfessionalId(int $profileId): ?string
    {
        return $this->repository->getEmailByProfessionalId($profileId);
    }
}

