<?php

namespace App\Domain\ChangePassword\Contracts;

use App\Application\ChangePassword\DTOs\ChangePasswordData;

interface ChangePasswordRepositoryInterface
{
    public function update(ChangePasswordData $payload): mixed;
}
