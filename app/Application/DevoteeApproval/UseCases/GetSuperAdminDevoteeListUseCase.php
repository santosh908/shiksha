<?php

namespace App\Application\DevoteeApproval\UseCases;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

class GetSuperAdminDevoteeListUseCase
{
    public function __construct(
        private readonly DevoteeApprovalRepositoryInterface $repository
    ) {
    }

    public function execute(): array
    {
        return $this->repository->getSuperAdminDevoteeList();
    }
}

