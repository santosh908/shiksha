<?php

namespace App\Infrastructure\ShikshaAppUser;

use App\Domain\ShikshaAppUser\Contracts\ShikshaAppUserRepositoryInterface;
use App\Services\ShikshaAppUser\ShikshaAppUserServices;

class LegacyShikshaAppUserRepository implements ShikshaAppUserRepositoryInterface
{
    public function __construct(
        private readonly ShikshaAppUserServices $service
    ) {
    }

    public function list(): array { return $this->service->ShikshAppUserList(); }
    public function permissions(): array { return $this->service->getPermissionList(); }
    public function create(mixed $payload): mixed { return $this->service->createShikshAppUser($payload); }
    public function update(mixed $payload): mixed { return $this->service->updateShikshAppUser($payload); }
    public function delete(int|string $id): mixed { return $this->service->deleteShikshAppUser($id); }
}
