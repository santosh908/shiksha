<?php

namespace App\Application\DevoteeModule\UseCases;

use App\Application\DevoteeModule\DTOs\GetDevoteeModuleDetailsData;
use App\Application\DevoteeModule\Validators\GetDevoteeModuleDetailsValidator;
use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;

class GetDevoteeModuleDetailsUseCase
{
    public function __construct(
        private readonly DevoteeModuleRepositoryInterface $repository,
        private readonly GetDevoteeModuleDetailsValidator $validator
    ) {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function execute(GetDevoteeModuleDetailsData $data): ?array
    {
        $this->validator->validate($data);
        return $this->repository->details($data->id);
    }
}
