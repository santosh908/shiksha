<?php

namespace App\Application\DevoteeExam\UseCases;

use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;

class FinalizeDevoteeExamUseCase
{
    public function __construct(
        private readonly DevoteeExamRepositoryInterface $repository
    ) {
    }

    public function execute(int $examId): mixed
    {
        return $this->repository->finalizeExam($examId);
    }
}
