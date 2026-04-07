<?php

namespace App\Services;

use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use App\Application\ExamOps\DTOs\UpdateMarksData;
use App\Application\ExamOps\DTOs\VerifyExamListFilterData;
use App\Application\ExamOps\UseCases\AllowExamRetakeUseCase;
use App\Application\ExamOps\UseCases\GetVerifyExamListUseCase;
use App\Application\ExamOps\UseCases\UpdateMarksUseCase;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;

class ExamOpsApplicationService
{
    public function __construct(
        private readonly ExamOpsRepositoryInterface $repository,
        private readonly GetVerifyExamListUseCase $getVerifyExamListUseCase,
        private readonly AllowExamRetakeUseCase $allowExamRetakeUseCase,
        private readonly UpdateMarksUseCase $updateMarksUseCase
    ) {}

    public function shikshaLevels(): array { return $this->repository->getShikshaLevels(); }
    public function examSessions(): array { return $this->repository->getExamSessions(); }
    public function allowExamList(): array { return $this->repository->getAllowExamList(); }
    public function loginIds(): array { return $this->repository->getLoginIds(); }
    public function sessionResultList(int|string $sessionId, int|string $levelId, string $loginId): array
    {
        return $this->repository->getSessionResultList($sessionId, $levelId, $loginId);
    }
    public function verifyExamList(VerifyExamListFilterData $filter): array { return $this->getVerifyExamListUseCase->execute($filter); }
    public function updateMarks(UpdateMarksData $payload): array { return $this->updateMarksUseCase->execute($payload); }
    public function allowRetake(AllowExamRetakeData $payload): bool { return $this->allowExamRetakeUseCase->execute($payload); }
}
