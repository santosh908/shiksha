<?php

namespace App\Infrastructure\ExamOps;

use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use App\Application\ExamOps\DTOs\UpdateMarksData;
use App\Application\ExamOps\DTOs\VerifyExamListFilterData;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;
use App\Services\Examination\ExaminationService;
use Illuminate\Http\Request;

class LegacyExamOpsRepository implements ExamOpsRepositoryInterface
{
    public function __construct(
        private readonly ExaminationService $service
    ) {}

    public function getShikshaLevels(): array { return $this->service->getShikshaLevelList(); }
    public function getExamSessions(): array { return $this->service->getExaminationSessionList(); }
    public function getAllowExamList(): array { return $this->service->getExamListToAllowDevotee(); }
    public function getLoginIds(): array { return $this->service->getLoginIdList(); }

    public function getVerifyExamList(VerifyExamListFilterData $filter): array
    {
        $payload = $filter->toArray();
        return $this->service->getVerifyExamList((int) $payload['level'], (int) $payload['session']);
    }

    public function getSessionResultList(int|string $examSessionId, int|string $shikshaLevelId, string $loginId): array
    {
        return $this->service->getSessionResultList(
            (int) $examSessionId,
            (int) $shikshaLevelId,
            $loginId
        );
    }

    public function updateMarks(UpdateMarksData $payload): array
    {
        $p = $payload->toArray();
        return $this->service->updateMarks(
            (int) $p['exam_id'],
            (string) $p['exam_level'],
            (string) $p['login_id'],
            (float) $p['total_obtain']
        );
    }

    public function allowRetake(AllowExamRetakeData $payload): bool
    {
        return $this->service->allowUserToRetakeExam(
            Request::create('/', 'POST', $payload->toArray())
        );
    }
}
