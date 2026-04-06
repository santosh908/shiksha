<?php

namespace App\Domain\AdminCatalog\Contracts;

interface AdminCatalogRepositoryInterface
{
    public function listBooks(): array;
    public function createBook(mixed $payload): mixed;
    public function updateBook(mixed $payload): mixed;
    public function deleteBook(int|string $id): mixed;

    public function listEducation(): array;
    public function createEducation(mixed $payload): mixed;
    public function updateEducation(mixed $payload): mixed;
    public function deleteEducation(int|string $id): mixed;

    public function listSeminars(): array;
    public function createSeminar(mixed $payload): mixed;
    public function updateSeminar(mixed $payload): mixed;
    public function deleteSeminar(int|string $id): mixed;

    public function listMeritalStatus(): array;
    public function createMeritalStatus(mixed $payload): mixed;
    public function updateMeritalStatus(mixed $payload): mixed;
    public function deleteMeritalStatus(int|string $id): mixed;

    public function listPrayers(): array;
    public function createPrayer(mixed $payload): mixed;
    public function updatePrayer(mixed $payload): mixed;
    public function deletePrayer(int|string $id): mixed;

    public function listProfessions(): array;
    public function createProfession(mixed $payload): mixed;
    public function updateProfession(mixed $payload): mixed;
    public function deleteProfession(int|string $id): mixed;

    /**
     * @return array{SubjectList: array<int, mixed>, shikshalevel: array<int, mixed>}
     */
    public function listSubjectsWithMasterData(): array;
    public function createSubject(mixed $payload): mixed;
    public function updateSubject(mixed $payload): mixed;
    public function deleteSubject(int|string $id): mixed;

    /**
     * @return array{ChapterList: array<int, mixed>, Subject: array<int, mixed>}
     */
    public function listChaptersWithMasterData(): array;
    public function createChapter(mixed $payload): mixed;
    public function updateChapter(mixed $payload): mixed;
    public function deleteChapter(int|string $id): mixed;

    public function listAsheryLeaders(): array;
    public function createAsheryLeader(mixed $payload): mixed;
    public function updateAsheryLeader(mixed $payload): mixed;
    public function deleteAsheryLeader(int|string $id): mixed;

    public function listBhaktiBhikshuks(): array;
    public function createBhaktiBhikshuk(mixed $payload): mixed;
    public function updateBhaktiBhikshuk(mixed $payload): mixed;
    public function deleteBhaktiBhikshuk(int|string $id): mixed;

    public function listAnnouncements(): array;
    public function createAnnouncement(mixed $payload): mixed;
    public function updateAnnouncement(mixed $payload): mixed;
    public function deleteAnnouncement(int|string $id): mixed;
}
