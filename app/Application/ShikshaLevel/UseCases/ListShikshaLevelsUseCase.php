<?php

namespace App\Application\ShikshaLevel\UseCases;

use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;

class ListShikshaLevelsUseCase
{
    public function __construct(
        private readonly ShikshaLevelRepositoryInterface $repository
    ) {
    }

    public function execute(): array
    {
        return $this->repository->list();
    }
}
