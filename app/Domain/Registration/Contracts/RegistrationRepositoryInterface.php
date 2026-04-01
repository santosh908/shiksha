<?php

namespace App\Domain\Registration\Contracts;

use App\Models\User;

interface RegistrationRepositoryInterface
{
    public function getRegistrationMasterData(): array;

    public function createCompleteRegistration(array $data): User;
}

