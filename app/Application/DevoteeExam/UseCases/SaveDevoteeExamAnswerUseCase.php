<?php

namespace App\Application\DevoteeExam\UseCases;

use App\Application\DevoteeExam\DTOs\SaveExamAnswerData;
use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;

class SaveDevoteeExamAnswerUseCase
{
    public function __construct(
        private readonly DevoteeExamRepositoryInterface $repository
    ) {
    }

    public function execute(SaveExamAnswerData $data): mixed
    {
        return $this->repository->saveSingleAnswer(
            $data->examId,
            $data->sessionId,
            $data->questionId,
            $data->selectedAnswer,
        );
    }
}
