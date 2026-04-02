<?php

namespace App\Application\ExamAdmin\UseCases;

use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;

class DeleteExamSessionUseCase
{
    public function __construct(
        private readonly ExamAdminRepositoryInterface $repository
    ) {
    }

    public function execute(int|string $id): mixed
    {
        return $this->repository->deleteExamSession($id);
    }
}
