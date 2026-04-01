<?php

namespace App\Application\DevoteeApproval\UseCases;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

class ApproveDevoteeUseCase
{
    public function __construct(
        private readonly DevoteeApprovalRepositoryInterface $repository
    ) {
    }

    public function execute(int $profileId): mixed
    {
        return $this->repository->approveDevoteeByProfileId($profileId);
    }
}

