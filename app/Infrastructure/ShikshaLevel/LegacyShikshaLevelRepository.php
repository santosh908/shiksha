<?php

namespace App\Infrastructure\ShikshaLevel;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;
use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;
use App\Services\ShikshaLevel\ShikshaLevelServices;
use Illuminate\Http\Request;

class LegacyShikshaLevelRepository implements ShikshaLevelRepositoryInterface
{
    public function __construct(
        private readonly ShikshaLevelServices $service
    ) {
    }

    public function list(): array
    {
        return $this->service->ShikshaLevelList();
    }

    public function create(SaveShikshaLevelData $payload): mixed
    {
        return $this->service->createShikshaLevel(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function update(UpdateShikshaLevelData $payload): mixed
    {
        return $this->service->updateShikshaLevel(
            Request::create('/', 'POST', $payload->toArray())
        );
    }

    public function delete(int|string $id): mixed
    {
        return $this->service->deleteShikshaLevel($id);
    }
}
