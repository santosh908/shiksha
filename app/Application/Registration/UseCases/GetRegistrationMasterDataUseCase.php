<?php

namespace App\Application\Registration\UseCases;

use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;

class GetRegistrationMasterDataUseCase
{
    public function __construct(
        private readonly RegistrationRepositoryInterface $registrationRepository
    ) {
    }

    public function execute(): array
    {
        return $this->registrationRepository->getRegistrationMasterData();
    }
}

