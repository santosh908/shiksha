<?php

namespace App\Application\DevoteePostRegistration\UseCases;

use App\Application\DevoteePostRegistration\DTOs\SaveDevoteeSeminarData;
use App\Application\DevoteePostRegistration\Validators\SaveDevoteeSeminarValidator;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;

class SaveDevoteeSeminarUseCase
{
    public function __construct(
        private readonly DevoteePostRegistrationRepositoryInterface $repository,
        private readonly SaveDevoteeSeminarValidator $validator
    ) {
    }

    public function execute(SaveDevoteeSeminarData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->saveDevoteeSeminar($payload);
    }
}
