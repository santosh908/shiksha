<?php

namespace App\Services;

use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;

class DevoteeModuleApplicationService
{
    public function __construct(
        private readonly DevoteeModuleRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<int, mixed>
     */
    public function list(): array
    {
        return $this->repository->list();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function details(int|string $id): ?array
    {
        return $this->repository->details($id);
    }
}
