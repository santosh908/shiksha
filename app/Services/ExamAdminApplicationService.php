<?php

namespace App\Services;

use App\Application\ExamAdmin\UseCases\CreateExaminationUseCase;
use App\Application\ExamAdmin\UseCases\CreateExamSessionUseCase;
use App\Application\ExamAdmin\UseCases\DeleteExamSessionUseCase;
use App\Application\ExamAdmin\UseCases\ListExaminationsForAdminUseCase;
use App\Application\ExamAdmin\UseCases\ListExamSessionsUseCase;
use App\Application\ExamAdmin\UseCases\UpdateExaminationUseCase;
use App\Application\ExamAdmin\UseCases\UpdateExamSessionUseCase;

class ExamAdminApplicationService
{
    public function __construct(
        private readonly ListExamSessionsUseCase $listExamSessionsUseCase,
        private readonly CreateExamSessionUseCase $createExamSessionUseCase,
        private readonly UpdateExamSessionUseCase $updateExamSessionUseCase,
        private readonly DeleteExamSessionUseCase $deleteExamSessionUseCase,
        private readonly ListExaminationsForAdminUseCase $listExaminationsForAdminUseCase,
        private readonly CreateExaminationUseCase $createExaminationUseCase,
        private readonly UpdateExaminationUseCase $updateExaminationUseCase,
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listExamSessions(): array
    {
        return $this->listExamSessionsUseCase->execute();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function createExamSession(array $payload): mixed
    {
        return $this->createExamSessionUseCase->execute($payload);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function updateExamSession(array $payload): mixed
    {
        return $this->updateExamSessionUseCase->execute($payload);
    }

    public function deleteExamSession(int|string $id): mixed
    {
        return $this->deleteExamSessionUseCase->execute($id);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listExaminations(): array
    {
        return $this->listExaminationsForAdminUseCase->execute();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function createExamination(array $payload): mixed
    {
        return $this->createExaminationUseCase->execute($payload);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function updateExamination(array $payload): mixed
    {
        return $this->updateExaminationUseCase->execute($payload);
    }
}
