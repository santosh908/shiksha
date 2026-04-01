<?php

namespace App\Domain\DevoteeApproval\Contracts;

interface DevoteeApprovalRepositoryInterface
{
    public function getSuperAdminDevoteeList(): array;

    public function approveDevoteeByProfileId(int $profileId): mixed;

    public function rejectDevoteeByProfileId(string $remarks, int $profileId): mixed;

    public function getEmailByProfessionalId(int $profileId): ?string;
}

