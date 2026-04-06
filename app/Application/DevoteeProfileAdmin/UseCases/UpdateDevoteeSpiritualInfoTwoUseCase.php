<?php

namespace App\Application\DevoteeProfileAdmin\UseCases;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;
use App\Application\DevoteeProfileAdmin\Validators\UpdateSpiritualInfoTwoValidator;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;

class UpdateDevoteeSpiritualInfoTwoUseCase
{
    public function __construct(
        private readonly DevoteeProfileAdminRepositoryInterface $repository,
        private readonly UpdateSpiritualInfoTwoValidator $validator
    ) {
    }

    public function execute(UpdateSpiritualInfoTwoData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->updateSpiritualInfoTwo($payload);
    }
}
