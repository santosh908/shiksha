<?php

namespace App\Application\Registration\UseCases;

use App\Application\Registration\DTOs\CompleteRegistrationData;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Models\User;

class RegisterCompleteDevoteeUseCase
{
    public function __construct(
        private readonly RegistrationRepositoryInterface $registrationRepository
    ) {
    }

    public function execute(CompleteRegistrationData $data): User
    {
        return $this->registrationRepository->createCompleteRegistration($data->payload);
    }
}

