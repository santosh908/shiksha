<?php

namespace App\Services;

use App\Domain\QuestionBank\Contracts\QuestionBankRepositoryInterface;

class QuestionBankApplicationService
{
    public function __construct(
        private readonly QuestionBankRepositoryInterface $repository
    ) {
    }

    public function list(): array { return $this->repository->list(); }
    public function subjects(): array { return $this->repository->subjects(); }
    public function chapters(): array { return $this->repository->chapters(); }
    public function create(mixed $payload): mixed { return $this->repository->create($payload); }
    public function update(mixed $payload): mixed { return $this->repository->update($payload); }
    public function delete(int|string $id): mixed { return $this->repository->delete($id); }
    public function addQuestionsToExams(mixed $payload): mixed { return $this->repository->addQuestionsToExams($payload); }
    public function filterQuestions(mixed $payload): mixed { return $this->repository->filterQuestions($payload); }
    public function removeQuestion(mixed $payload): mixed { return $this->repository->removeQuestion($payload); }
    public function bulkUpload(mixed $file): mixed { return $this->repository->bulkUpload($file); }
    public function examSessionsWithNames(): array { return $this->repository->getExamSessionsWithNames(); }
    public function examSessionsWithNamesByFilter(mixed $payload): array { return $this->repository->getExamSessionsWithNamesByFilter($payload); }
}
