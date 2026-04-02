<?php

namespace App\Services;

use App\Application\DevoteeExam\DTOs\SaveExamAnswerData;
use App\Application\DevoteeExam\UseCases\FinalizeDevoteeExamUseCase;
use App\Application\DevoteeExam\UseCases\GetDevoteeExamSessionStateUseCase;
use App\Application\DevoteeExam\UseCases\GetExamIntroDetailsUseCase;
use App\Application\DevoteeExam\UseCases\SaveDevoteeExamAnswerUseCase;

class DevoteeExamApplicationService
{
    public function __construct(
        private readonly GetExamIntroDetailsUseCase $getExamIntroDetailsUseCase,
        private readonly GetDevoteeExamSessionStateUseCase $getDevoteeExamSessionStateUseCase,
        private readonly SaveDevoteeExamAnswerUseCase $saveDevoteeExamAnswerUseCase,
        private readonly FinalizeDevoteeExamUseCase $finalizeDevoteeExamUseCase,
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getExamIntroDetails(int $examId): array
    {
        return $this->getExamIntroDetailsUseCase->execute($examId);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getDevoteeExamSessionState(int $examId): array
    {
        return $this->getDevoteeExamSessionStateUseCase->execute($examId);
    }

    public function saveAnswer(SaveExamAnswerData $data): mixed
    {
        return $this->saveDevoteeExamAnswerUseCase->execute($data);
    }

    public function finalizeExam(int $examId): mixed
    {
        return $this->finalizeDevoteeExamUseCase->execute($examId);
    }
}
