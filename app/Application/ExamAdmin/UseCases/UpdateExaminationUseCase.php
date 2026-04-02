<?php

namespace App\Application\ExamAdmin\UseCases;

use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;

class UpdateExaminationUseCase
{
    public function __construct(
        private readonly ExamAdminRepositoryInterface $repository
    ) {
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function execute(array $payload): mixed
    {
        return $this->repository->updateExamination($payload);
    }
}
