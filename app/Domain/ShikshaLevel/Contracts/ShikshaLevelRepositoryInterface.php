<?php

namespace App\Domain\ShikshaLevel\Contracts;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;

interface ShikshaLevelRepositoryInterface
{
    public function list(): array;

    public function create(SaveShikshaLevelData $payload): mixed;

    public function update(UpdateShikshaLevelData $payload): mixed;

    public function delete(int|string $id): mixed;
}
