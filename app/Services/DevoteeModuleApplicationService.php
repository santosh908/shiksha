<?php

namespace App\Services;

use App\Application\DevoteeModule\DTOs\GetDevoteeModuleDetailsData;
use App\Application\DevoteeModule\UseCases\GetDevoteeModuleDetailsUseCase;
use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;

class DevoteeModuleApplicationService
{
    public function __construct( 
        private readonly DevoteeModuleRepositoryInterface $repository,
        private readonly GetDevoteeModuleDetailsUseCase $getDevoteeModuleDetailsUseCase
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
    public function details(GetDevoteeModuleDetailsData $data): ?array
    {
        return $this->getDevoteeModuleDetailsUseCase->execute($data);
    }
}
