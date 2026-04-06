<?php

namespace App\Services;

use App\Domain\AdminCatalog\Contracts\AdminCatalogRepositoryInterface;

class AdminCatalogApplicationService
{
    public function __construct(
        private readonly AdminCatalogRepositoryInterface $repository
    ) {
    }

    public function listBooks(): array { return $this->repository->listBooks(); }
    public function createBook(mixed $payload): mixed { return $this->repository->createBook($payload); }
    public function updateBook(mixed $payload): mixed { return $this->repository->updateBook($payload); }
    public function deleteBook(int|string $id): mixed { return $this->repository->deleteBook($id); }

    public function listEducation(): array { return $this->repository->listEducation(); }
    public function createEducation(mixed $payload): mixed { return $this->repository->createEducation($payload); }
    public function updateEducation(mixed $payload): mixed { return $this->repository->updateEducation($payload); }
    public function deleteEducation(int|string $id): mixed { return $this->repository->deleteEducation($id); }

    public function listSeminars(): array { return $this->repository->listSeminars(); }
    public function createSeminar(mixed $payload): mixed { return $this->repository->createSeminar($payload); }
    public function updateSeminar(mixed $payload): mixed { return $this->repository->updateSeminar($payload); }
    public function deleteSeminar(int|string $id): mixed { return $this->repository->deleteSeminar($id); }

    public function listMeritalStatus(): array { return $this->repository->listMeritalStatus(); }
    public function createMeritalStatus(mixed $payload): mixed { return $this->repository->createMeritalStatus($payload); }
    public function updateMeritalStatus(mixed $payload): mixed { return $this->repository->updateMeritalStatus($payload); }
    public function deleteMeritalStatus(int|string $id): mixed { return $this->repository->deleteMeritalStatus($id); }

    public function listPrayers(): array { return $this->repository->listPrayers(); }
    public function createPrayer(mixed $payload): mixed { return $this->repository->createPrayer($payload); }
    public function updatePrayer(mixed $payload): mixed { return $this->repository->updatePrayer($payload); }
    public function deletePrayer(int|string $id): mixed { return $this->repository->deletePrayer($id); }

    public function listProfessions(): array { return $this->repository->listProfessions(); }
    public function createProfession(mixed $payload): mixed { return $this->repository->createProfession($payload); }
    public function updateProfession(mixed $payload): mixed { return $this->repository->updateProfession($payload); }
    public function deleteProfession(int|string $id): mixed { return $this->repository->deleteProfession($id); }

    public function listSubjectsWithMasterData(): array { return $this->repository->listSubjectsWithMasterData(); }
    public function createSubject(mixed $payload): mixed { return $this->repository->createSubject($payload); }
    public function updateSubject(mixed $payload): mixed { return $this->repository->updateSubject($payload); }
    public function deleteSubject(int|string $id): mixed { return $this->repository->deleteSubject($id); }

    public function listChaptersWithMasterData(): array { return $this->repository->listChaptersWithMasterData(); }
    public function createChapter(mixed $payload): mixed { return $this->repository->createChapter($payload); }
    public function updateChapter(mixed $payload): mixed { return $this->repository->updateChapter($payload); }
    public function deleteChapter(int|string $id): mixed { return $this->repository->deleteChapter($id); }

    public function listAsheryLeaders(): array { return $this->repository->listAsheryLeaders(); }
    public function createAsheryLeader(mixed $payload): mixed { return $this->repository->createAsheryLeader($payload); }
    public function updateAsheryLeader(mixed $payload): mixed { return $this->repository->updateAsheryLeader($payload); }
    public function deleteAsheryLeader(int|string $id): mixed { return $this->repository->deleteAsheryLeader($id); }

    public function listBhaktiBhikshuks(): array { return $this->repository->listBhaktiBhikshuks(); }
    public function createBhaktiBhikshuk(mixed $payload): mixed { return $this->repository->createBhaktiBhikshuk($payload); }
    public function updateBhaktiBhikshuk(mixed $payload): mixed { return $this->repository->updateBhaktiBhikshuk($payload); }
    public function deleteBhaktiBhikshuk(int|string $id): mixed { return $this->repository->deleteBhaktiBhikshuk($id); }

    public function listAnnouncements(): array { return $this->repository->listAnnouncements(); }
    public function createAnnouncement(mixed $payload): mixed { return $this->repository->createAnnouncement($payload); }
    public function updateAnnouncement(mixed $payload): mixed { return $this->repository->updateAnnouncement($payload); }
    public function deleteAnnouncement(int|string $id): mixed { return $this->repository->deleteAnnouncement($id); }
}
