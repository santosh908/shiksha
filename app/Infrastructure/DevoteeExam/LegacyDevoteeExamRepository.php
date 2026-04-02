<?php

namespace App\Infrastructure\DevoteeExam;

use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;
use App\Models\FinalSubmited;
use App\Services\Examination\ExaminationService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LegacyDevoteeExamRepository implements DevoteeExamRepositoryInterface
{
    public function __construct(
        private readonly ExaminationService $examinationService
    ) {
    }

    public function getExamIntroDetailsByExamId(int $examId): array
    {
        return $this->examinationService->ExamDetailsById($examId);
    }

    public function getDevoteeExamDetailsByExamId(int $examId): array
    {
        return $this->examinationService->DevoteeExamDetailsById($examId);
    }

    public function saveSingleAnswer(int $examId, int $sessionId, int $questionId, string $selectedAnswer): mixed
    {
        $request = Request::create('/', 'POST', [
            'examId' => $examId,
            'sessionId' => $sessionId,
            'questionId' => $questionId,
            'selectedAnswer' => $selectedAnswer,
        ]);

        return $this->examinationService->SaveSingleQuestion($request);
    }

    public function finalizeExam(int $examId): mixed
    {
        return DB::transaction(function () use ($examId) {
            $userId = Auth::id();
            $existing = FinalSubmited::query()
                ->where('user_id', $userId)
                ->where('exam_id', $examId)
                ->lockForUpdate()
                ->first();

            if ($existing !== null && (int) $existing->is_submitted === 1) {
                return $existing;
            }

            $request = Request::create('/', 'POST', ['examId' => $examId]);

            try {
                return $this->examinationService->SubmitExam($request);
            } catch (QueryException $e) {
                if (! $this->isUniqueViolation($e)) {
                    throw $e;
                }

                return FinalSubmited::query()
                    ->where('user_id', $userId)
                    ->where('exam_id', $examId)
                    ->firstOrFail();
            }
        });
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        $message = $e->getMessage();

        return str_contains($message, 'Duplicate entry')
            || str_contains($message, 'UNIQUE constraint failed')
            || str_contains($message, 'unique constraint')
            || str_contains($message, 'duplicate key value violates unique constraint');
    }
}
