<?php

namespace App\Services;

use App\Domain\BhaktiBhikshuk\Contracts\BhaktiBhikshukRepositoryInterface;

class BhaktiBhikshukApplicationService
{
    public function __construct(
        private readonly BhaktiBhikshukRepositoryInterface $repository
    ) {
    }

    public function list(): array
    {
        return $this->repository->list();
    }

    public function create(mixed $payload): mixed
    {
        return $this->repository->create($payload);
    }

    public function update(mixed $payload): mixed
    {
        return $this->repository->update($payload);
    }

    public function delete(int|string $id): mixed
    {
        return $this->repository->delete($id);
    }
}

