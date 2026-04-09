<?php

namespace App\Domain\BhaktiBhikshuk\Contracts;

interface BhaktiBhikshukRepositoryInterface
{
    public function list(): array;
    public function create(mixed $payload): mixed;
    public function update(mixed $payload): mixed;
    public function delete(int|string $id): mixed;
}

