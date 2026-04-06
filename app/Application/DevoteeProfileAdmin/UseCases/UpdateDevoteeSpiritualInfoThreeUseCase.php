<?php

namespace App\Application\DevoteeProfileAdmin\UseCases;

use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use App\Application\DevoteeProfileAdmin\Validators\UpdateSpiritualInfoThreeValidator;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;

class UpdateDevoteeSpiritualInfoThreeUseCase
{
    public function __construct(
        private readonly DevoteeProfileAdminRepositoryInterface $repository,
        private readonly UpdateSpiritualInfoThreeValidator $validator
    ) {
    }

    public function execute(UpdateSpiritualInfoThreeData $payload): mixed
    {
        $this->validator->validate($payload);
        return $this->repository->updateSpiritualInfoThree($payload);
    }
}
