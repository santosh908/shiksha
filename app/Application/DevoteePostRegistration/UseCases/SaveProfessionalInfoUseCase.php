<?php

namespace App\Application\DevoteePostRegistration\UseCases;

use App\Application\DevoteePostRegistration\DTOs\SaveProfessionalInfoData;
use App\Application\DevoteePostRegistration\Validators\SaveProfessionalInfoValidator;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;

class SaveProfessionalInfoUseCase
{
    public function __construct(
        private readonly DevoteePostRegistrationRepositoryInterface $repository,
        private readonly SaveProfessionalInfoValidator $validator
    ) {
    }

    public function execute(SaveProfessionalInfoData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->saveProfessionalInfo($payload);
    }
}
