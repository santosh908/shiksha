<?php

namespace App\Domain\ShikshaAppUser\Contracts;

interface ShikshaAppUserRepositoryInterface
{
    public function list(): array;
    public function permissions(): array;
    public function create(mixed $payload): mixed;
    public function update(mixed $payload): mixed;
    public function delete(int|string $id): mixed;
}
