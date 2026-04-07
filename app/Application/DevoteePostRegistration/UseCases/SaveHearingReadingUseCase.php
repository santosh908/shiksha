<?php

namespace App\Application\DevoteePostRegistration\UseCases;

use App\Application\DevoteePostRegistration\DTOs\SaveHearingReadingData;
use App\Application\DevoteePostRegistration\Validators\SaveHearingReadingValidator;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;

class SaveHearingReadingUseCase
{
    public function __construct(
        private readonly DevoteePostRegistrationRepositoryInterface $repository,
        private readonly SaveHearingReadingValidator $validator
    ) {
    }

    public function execute(SaveHearingReadingData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->saveHearingReading($payload);
    }
}
