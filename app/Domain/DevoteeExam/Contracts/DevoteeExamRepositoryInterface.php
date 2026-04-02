<?php

namespace App\Domain\DevoteeExam\Contracts;

interface DevoteeExamRepositoryInterface
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function getExamIntroDetailsByExamId(int $examId): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getDevoteeExamDetailsByExamId(int $examId): array;

    public function saveSingleAnswer(int $examId, int $sessionId, int $questionId, string $selectedAnswer): mixed;

    public function finalizeExam(int $examId): mixed;
}
