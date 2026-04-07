<?php

namespace App\Application\DevoteePostRegistration\UseCases;

use App\Application\DevoteePostRegistration\DTOs\SavePersonalInfoData;
use App\Application\DevoteePostRegistration\Validators\SavePersonalInfoValidator;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;

class SavePersonalInfoUseCase
{
    public function __construct(
        private readonly DevoteePostRegistrationRepositoryInterface $repository,
        private readonly SavePersonalInfoValidator $validator
    ) {
    }

    public function execute(SavePersonalInfoData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->savePersonalInfo($payload);
    }
}
