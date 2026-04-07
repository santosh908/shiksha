<?php

namespace App\Application\ExamOps\UseCases;

use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use App\Application\ExamOps\Validators\AllowExamRetakeValidator;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;

class AllowExamRetakeUseCase
{
    public function __construct(
        private readonly ExamOpsRepositoryInterface $repository,
        private readonly AllowExamRetakeValidator $validator
    ) {}

    public function execute(AllowExamRetakeData $payload): bool
    {
        $this->validator->validate($payload);
        return $this->repository->allowRetake($payload);
    }
}
