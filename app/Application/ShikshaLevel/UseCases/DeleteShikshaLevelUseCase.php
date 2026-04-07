<?php

namespace App\Application\ShikshaLevel\UseCases;

use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;

class DeleteShikshaLevelUseCase
{
    public function __construct(
        private readonly ShikshaLevelRepositoryInterface $repository
    ) {
    }

    public function execute(int|string $id): mixed
    {
        return $this->repository->delete($id);
    }
}
