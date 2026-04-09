<?php

namespace App\Infrastructure\BhaktiBhikshuk;

use App\Domain\BhaktiBhikshuk\Contracts\BhaktiBhikshukRepositoryInterface;
use App\Services\BhaktiBhikshuk\BhaktiBhikshukService;

class LegacyBhaktiBhikshukRepository implements BhaktiBhikshukRepositoryInterface
{
    public function __construct(
        private readonly BhaktiBhikshukService $service
    ) {
    }

    public function list(): array
    {
        return $this->service->BhaktiBhikshukList();
    }

    public function create(mixed $payload): mixed
    {
        return $this->service->createBhaktiBhikshuk($payload);
    }

    public function update(mixed $payload): mixed
    {
        return $this->service->updateBhaktiVrikshuk($payload);
    }

    public function delete(int|string $id): mixed
    {
        return $this->service->delete($id);
    }
}

