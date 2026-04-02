<?php

namespace App\Infrastructure\ExamAdmin;

use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;
use App\Services\Examination\ExaminationService;
use Illuminate\Http\Request;

class LegacyExamAdminRepository implements ExamAdminRepositoryInterface
{
    public function __construct(
        private readonly ExaminationService $examinationService
    ) {
    }

    public function listExamSessions(): array
    {
        return $this->examinationService->getExamSessionList();
    }

    public function createExamSession(array $payload): mixed
    {
        $payload = $this->withSessionDefaults($payload);

        return $this->examinationService->createExamSession(
            Request::create('/', 'POST', $payload)
        );
    }

    public function updateExamSession(array $payload): mixed
    {
        $payload = $this->withSessionDefaults($payload);

        return $this->examinationService->updateExamSession(
            Request::create('/', 'PUT', $payload)
        );
    }

    public function deleteExamSession(int|string $id): mixed
    {
        return $this->examinationService->deleteExamSession($id);
    }

    public function listExaminations(): array
    {
        return $this->examinationService->ExaminationList();
    }

    public function createExamination(array $payload): mixed
    {
        return $this->examinationService->createExamination(
            Request::create('/', 'POST', $this->withExaminationDefaults($payload))
        );
    }

    public function updateExamination(array $payload): mixed
    {
        return $this->examinationService->updateExamination(
            Request::create('/', 'PUT', $this->withExaminationDefaults($payload))
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function withSessionDefaults(array $payload): array
    {
        if (! array_key_exists('session_start_date', $payload)) {
            $payload['session_start_date'] = null;
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function withExaminationDefaults(array $payload): array
    {
        if (! array_key_exists('remarks', $payload)) {
            $payload['remarks'] = null;
        }

        return $payload;
    }
}
