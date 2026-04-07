<?php

namespace App\Domain\ExamOps\Contracts;

use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use App\Application\ExamOps\DTOs\UpdateMarksData;
use App\Application\ExamOps\DTOs\VerifyExamListFilterData;

interface ExamOpsRepositoryInterface
{
    public function getShikshaLevels(): array;
    public function getExamSessions(): array;
    public function getAllowExamList(): array;
    public function getLoginIds(): array;
    public function getVerifyExamList(VerifyExamListFilterData $filter): array;
    public function getSessionResultList(int|string $examSessionId, int|string $shikshaLevelId, string $loginId): array;
    public function updateMarks(UpdateMarksData $payload): array;
    public function allowRetake(AllowExamRetakeData $payload): bool;
}
