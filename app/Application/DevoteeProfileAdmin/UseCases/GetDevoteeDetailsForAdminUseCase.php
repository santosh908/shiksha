<?php

namespace App\Application\DevoteeProfileAdmin\UseCases;

use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;

class GetDevoteeDetailsForAdminUseCase
{
    public function __construct(
        private readonly DevoteeProfileAdminRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function execute(int $userId): array
    {
        return $this->repository->getDevoteeDetails($userId);
    }
}
