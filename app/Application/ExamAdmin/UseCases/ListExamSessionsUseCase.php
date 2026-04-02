<?php

namespace App\Application\ExamAdmin\UseCases;

use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;

class ListExamSessionsUseCase
{
    public function __construct(
        private readonly ExamAdminRepositoryInterface $repository
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function execute(): array
    {
        return $this->repository->listExamSessions();
    }
}
