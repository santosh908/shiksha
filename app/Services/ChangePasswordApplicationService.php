<?php

namespace App\Services;

use App\Application\ChangePassword\DTOs\ChangePasswordData;
use App\Application\ChangePassword\UseCases\ChangePasswordUseCase;

class ChangePasswordApplicationService
{
    public function __construct(
        private readonly ChangePasswordUseCase $changePasswordUseCase
    ) {
    }

    public function update(ChangePasswordData $payload): mixed
    {
        return $this->changePasswordUseCase->execute($payload);
    }
}
