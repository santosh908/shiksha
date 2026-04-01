<?php

namespace App\Application\DevoteeApproval\UseCases;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

class RejectDevoteeUseCase
{
    public function __construct(
        private readonly DevoteeApprovalRepositoryInterface $repository
    ) {
    }

    public function execute(string $remarks, int $profileId): mixed
    {
        return $this->repository->rejectDevoteeByProfileId($remarks, $profileId);
    }
}

