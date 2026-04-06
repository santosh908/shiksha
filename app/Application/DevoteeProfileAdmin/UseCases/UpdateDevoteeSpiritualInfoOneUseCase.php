<?php

namespace App\Application\DevoteeProfileAdmin\UseCases;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use App\Application\DevoteeProfileAdmin\Validators\UpdateSpiritualInfoOneValidator;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;

class UpdateDevoteeSpiritualInfoOneUseCase
{
    public function __construct(
        private readonly DevoteeProfileAdminRepositoryInterface $repository,
        private readonly UpdateSpiritualInfoOneValidator $validator
    ) {
    }

    public function execute(UpdateSpiritualInfoOneData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->updateSpiritualInfoOne($payload);
    }
}
