<?php

namespace App\Application\DevoteeProfileAdmin\UseCases;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Application\DevoteeProfileAdmin\Validators\UpdatePersonalInfoValidator;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;

class UpdateDevoteePersonalInfoUseCase
{
    public function __construct(
        private readonly DevoteeProfileAdminRepositoryInterface $repository,
        private readonly UpdatePersonalInfoValidator $validator
    ) {
    }

    public function execute(UpdatePersonalInfoData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->updatePersonalInfo($payload);
    }
}
