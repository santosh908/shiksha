<?php

namespace App\Domain\QuestionBank\Contracts;

interface QuestionBankRepositoryInterface
{
    public function list(): array;
    public function subjects(): array;
    public function chapters(): array;
    public function create(mixed $payload): mixed;
    public function update(mixed $payload): mixed;
    public function delete(int|string $id): mixed;
    public function addQuestionsToExams(mixed $payload): mixed;
    public function filterQuestions(mixed $payload): mixed;
    public function removeQuestion(mixed $payload): mixed;
    public function bulkUpload(mixed $file): mixed;
    public function getExamSessionsWithNames(): array;
    public function getExamSessionsWithNamesByFilter(mixed $payload): array;
}
