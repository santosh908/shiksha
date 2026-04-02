<?php

namespace App\Application\DevoteeExam\UseCases;

use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;

class GetDevoteeExamSessionStateUseCase
{
    public function __construct(
        private readonly DevoteeExamRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function execute(int $examId): array
    {
        return $this->repository->getDevoteeExamDetailsByExamId($examId);
    }
}
