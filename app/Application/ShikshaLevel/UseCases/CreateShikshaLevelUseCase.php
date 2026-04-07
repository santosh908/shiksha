<?php

namespace App\Application\ShikshaLevel\UseCases;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use App\Application\ShikshaLevel\Validators\SaveShikshaLevelValidator;
use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;

class CreateShikshaLevelUseCase
{
    public function __construct(
        private readonly ShikshaLevelRepositoryInterface $repository,
        private readonly SaveShikshaLevelValidator $validator
    ) {
    }

    public function execute(SaveShikshaLevelData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->create($payload);
    }
}
