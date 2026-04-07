<?php

namespace App\Services;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;
use App\Application\ShikshaLevel\UseCases\CreateShikshaLevelUseCase;
use App\Application\ShikshaLevel\UseCases\DeleteShikshaLevelUseCase;
use App\Application\ShikshaLevel\UseCases\ListShikshaLevelsUseCase;
use App\Application\ShikshaLevel\UseCases\UpdateShikshaLevelUseCase;

class ShikshaLevelApplicationService
{
    public function __construct(
        private readonly ListShikshaLevelsUseCase $listShikshaLevelsUseCase,
        private readonly CreateShikshaLevelUseCase $createShikshaLevelUseCase,
        private readonly UpdateShikshaLevelUseCase $updateShikshaLevelUseCase,
        private readonly DeleteShikshaLevelUseCase $deleteShikshaLevelUseCase
    ) {
    }

    public function list(): array
    {
        return $this->listShikshaLevelsUseCase->execute();
    }

    public function create(SaveShikshaLevelData $payload): mixed
    {
        return $this->createShikshaLevelUseCase->execute($payload);
    }

    public function update(UpdateShikshaLevelData $payload): mixed
    {
        return $this->updateShikshaLevelUseCase->execute($payload);
    }

    public function delete(int|string $id): mixed
    {
        return $this->deleteShikshaLevelUseCase->execute($id);
    }
}
