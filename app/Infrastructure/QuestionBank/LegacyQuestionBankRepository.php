<?php

namespace App\Infrastructure\QuestionBank;

use App\Domain\QuestionBank\Contracts\QuestionBankRepositoryInterface;
use App\Services\Examination\ExaminationService;
use App\Services\Question\QuestionBankService;

class LegacyQuestionBankRepository implements QuestionBankRepositoryInterface
{
    public function __construct(
        private readonly QuestionBankService $questionBankService,
        private readonly ExaminationService $examinationService
    ) {
    }

    public function list(): array { return $this->questionBankService->QuestionBankList(); }
    public function subjects(): array { return $this->questionBankService->SubjectList(); }
    public function chapters(): array { return $this->questionBankService->ChapterList(); }
    public function create(mixed $payload): mixed { return $this->questionBankService->createQuestionBank($payload); }
    public function update(mixed $payload): mixed { return $this->questionBankService->updateQuestionBank($payload); }
    public function delete(int|string $id): mixed { return \App\Models\QuestionBank\QuestionBank::where('id', $id)->delete(); }
    public function addQuestionsToExams(mixed $payload): mixed { return $this->questionBankService->addQuestionsToExams($payload); }
    public function filterQuestions(mixed $payload): mixed { return $this->questionBankService->filterQuestions($payload); }
    public function removeQuestion(mixed $payload): mixed { return $this->questionBankService->removeQuestion($payload); }
    public function bulkUpload(mixed $file): mixed { return $this->questionBankService->createBulkQuestionBank($file); }
    public function getExamSessionsWithNames(): array { return $this->examinationService->getExamSessionWithExamName(); }
    public function getExamSessionsWithNamesByFilter(mixed $payload): array { return $this->examinationService->getExamSessionWithExamNameByFilter($payload); }
}
