<?php

namespace App\Domain\DevoteeModule\Contracts;

interface DevoteeModuleRepositoryInterface
{
    /**
     * @return array<int, mixed>
     */
    public function list(): array;

    /**
     * @return array<string, mixed>|null
     */
    public function details(int|string $id): ?array;
}
