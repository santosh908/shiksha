<?php

namespace App\Infrastructure\ChangePassword;

use App\Application\ChangePassword\DTOs\ChangePasswordData;
use App\Domain\ChangePassword\Contracts\ChangePasswordRepositoryInterface;
use App\Services\ChangePassword\ChangePasswordServices;
use Illuminate\Http\Request;

class LegacyChangePasswordRepository implements ChangePasswordRepositoryInterface
{
    public function __construct(
        private readonly ChangePasswordServices $service
    ) {
    }

    public function update(ChangePasswordData $payload): mixed
    {
        return $this->service->UpdatePassword(
            Request::create('/', 'POST', $payload->toArray())
        );
    }
}
