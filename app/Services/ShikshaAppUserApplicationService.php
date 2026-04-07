<?php

namespace App\Services;

use App\Domain\ShikshaAppUser\Contracts\ShikshaAppUserRepositoryInterface;

class ShikshaAppUserApplicationService
{
    public function __construct(
        private readonly ShikshaAppUserRepositoryInterface $repository
    ) {
    }

    public function list(): array { return $this->repository->list(); }
    public function permissions(): array { return $this->repository->permissions(); }
    public function create(mixed $payload): mixed { return $this->repository->create($payload); }
    public function update(mixed $payload): mixed { return $this->repository->update($payload); }
    public function delete(int|string $id): mixed { return $this->repository->delete($id); }
}
