<?php

namespace App\Domain\ExamAdmin\Contracts;

interface ExamAdminRepositoryInterface
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function listExamSessions(): array;

    /**
     * @param  array<string, mixed>  $payload  session_name, session_description, session_start_date (optional)
     */
    public function createExamSession(array $payload): mixed;

    /**
     * @param  array<string, mixed>  $payload  must include id
     */
    public function updateExamSession(array $payload): mixed;

    public function deleteExamSession(int|string $id): mixed;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listExaminations(): array;

    /**
     * @param  array<string, mixed>  $payload  exam_session_id, exam_level_id, remarks, date, start_time, duration, no_of_question, total_marks, qualifying_marks, is_active
     */
    public function createExamination(array $payload): mixed;

    /**
     * @param  array<string, mixed>  $payload  must include id
     */
    public function updateExamination(array $payload): mixed;
}
