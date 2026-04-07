<?php

namespace App\Application\ShikshaLevel\UseCases;

use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;
use App\Application\ShikshaLevel\Validators\UpdateShikshaLevelValidator;
use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;

class UpdateShikshaLevelUseCase
{
    public function __construct(
        private readonly ShikshaLevelRepositoryInterface $repository,
        private readonly UpdateShikshaLevelValidator $validator
    ) {
    }

    public function execute(UpdateShikshaLevelData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->update($payload);
    }
}
