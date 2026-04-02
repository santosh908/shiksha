<?php

namespace App\Application\DevoteeExam\DTOs;

final class SaveExamAnswerData
{
    public function __construct(
        public readonly int $examId,
        public readonly int $sessionId,
        public readonly int $questionId,
        public readonly string $selectedAnswer,
    ) {
    }

    /**
     * @param  array{examId: int|string, sessionId: int|string, questionId: int|string, selectedAnswer: string}  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            (int) $validated['examId'],
            (int) $validated['sessionId'],
            (int) $validated['questionId'],
            (string) $validated['selectedAnswer'],
        );
    }
}
