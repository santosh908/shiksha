<?php

namespace App\Application\ExamOps\UseCases;

use App\Application\ExamOps\DTOs\UpdateMarksData;
use App\Application\ExamOps\Validators\UpdateMarksValidator;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;

class UpdateMarksUseCase
{
    public function __construct(
        private readonly ExamOpsRepositoryInterface $repository,
        private readonly UpdateMarksValidator $validator
    ) {}

    public function execute(UpdateMarksData $payload): array
    {
        $this->validator->validate($payload);
        return $this->repository->updateMarks($payload);
    }
}
