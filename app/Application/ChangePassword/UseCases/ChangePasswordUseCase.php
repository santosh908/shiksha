<?php

namespace App\Application\ChangePassword\UseCases;

use App\Application\ChangePassword\DTOs\ChangePasswordData;
use App\Application\ChangePassword\Validators\ChangePasswordValidator;
use App\Domain\ChangePassword\Contracts\ChangePasswordRepositoryInterface;

class ChangePasswordUseCase
{
    public function __construct(
        private readonly ChangePasswordRepositoryInterface $repository,
        private readonly ChangePasswordValidator $validator
    ) {
    }

    public function execute(ChangePasswordData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->update($payload);
    }
}
