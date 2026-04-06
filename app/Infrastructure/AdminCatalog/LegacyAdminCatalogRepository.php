<?php

namespace App\Infrastructure\AdminCatalog;

use App\Domain\AdminCatalog\Contracts\AdminCatalogRepositoryInterface;
use App\Services\Announcement\AnnouncementService;
use App\Services\AshreyLeader\AshreyLeadeServices;
use App\Services\BhaktiBhikshuk\BhaktiBhikshukService;
use App\Services\BookServices\BookServices;
use App\Services\Chapter\ChapterServices;
use App\Services\Education\EducationService;
use App\Services\Memorisedprayers\Memorisedprayerservice;
use App\Services\MeritalStatus\MeritalStatusService;
use App\Services\Profession\ProfessionService;
use App\Services\Seminar\SeminarService;
use App\Services\Subject\SubjectServices;

class LegacyAdminCatalogRepository implements AdminCatalogRepositoryInterface
{
    public function __construct(
        private readonly BookServices $bookServices,
        private readonly EducationService $educationService,
        private readonly SeminarService $seminarService,
        private readonly MeritalStatusService $meritalStatusService,
        private readonly Memorisedprayerservice $memorisedprayerservice,
        private readonly ProfessionService $professionService,
        private readonly SubjectServices $subjectServices,
        private readonly ChapterServices $chapterServices,
        private readonly AshreyLeadeServices $ashreyLeadeServices,
        private readonly BhaktiBhikshukService $bhaktiBhikshukService,
        private readonly AnnouncementService $announcementService,
    ) {
    }

    public function listBooks(): array { return $this->bookServices->BookList(); }
    public function createBook(mixed $payload): mixed { return $this->bookServices->createBook($payload); }
    public function updateBook(mixed $payload): mixed { return $this->bookServices->updateBook($payload); }
    public function deleteBook(int|string $id): mixed { return $this->bookServices->deleteBook($id); }

    public function listEducation(): array { return $this->educationService->EducationList(); }
    public function createEducation(mixed $payload): mixed { return $this->educationService->createEducation($payload); }
    public function updateEducation(mixed $payload): mixed { return $this->educationService->updateEducation($payload); }
    public function deleteEducation(int|string $id): mixed { return $this->educationService->deleteEducation($id); }

    public function listSeminars(): array { return $this->seminarService->SeminarList(); }
    public function createSeminar(mixed $payload): mixed { return $this->seminarService->createSeminar($payload); }
    public function updateSeminar(mixed $payload): mixed { return $this->seminarService->updateSeminar($payload); }
    public function deleteSeminar(int|string $id): mixed { return $this->seminarService->deleteSeminar($id); }

    public function listMeritalStatus(): array { return $this->meritalStatusService->MeritalStatusList(); }
    public function createMeritalStatus(mixed $payload): mixed { return $this->meritalStatusService->createMeritalstatus($payload); }
    public function updateMeritalStatus(mixed $payload): mixed { return $this->meritalStatusService->updateMeritalStatus($payload); }
    public function deleteMeritalStatus(int|string $id): mixed { return $this->meritalStatusService->deleteMeritalStatus($id); }

    public function listPrayers(): array { return $this->memorisedprayerservice->PrayerList(); }
    public function createPrayer(mixed $payload): mixed { return $this->memorisedprayerservice->createprayers($payload); }
    public function updatePrayer(mixed $payload): mixed { return $this->memorisedprayerservice->updatePrayers($payload); }
    public function deletePrayer(int|string $id): mixed { return $this->memorisedprayerservice->deleteMeritalStatus($id); }

    public function listProfessions(): array { return $this->professionService->ProfessionList(); }
    public function createProfession(mixed $payload): mixed { return $this->professionService->createProfession($payload); }
    public function updateProfession(mixed $payload): mixed { return $this->professionService->updateProfession($payload); }
    public function deleteProfession(int|string $id): mixed { return $this->professionService->deleteProfession($id); }

    public function listSubjectsWithMasterData(): array
    {
        return [
            'SubjectList' => $this->subjectServices->SubjectList(),
            'shikshalevel' => $this->subjectServices->shikshalevel(),
        ];
    }
    public function createSubject(mixed $payload): mixed { return $this->subjectServices->createSubject($payload); }
    public function updateSubject(mixed $payload): mixed { return $this->subjectServices->updateSubject($payload); }
    public function deleteSubject(int|string $id): mixed { return $this->subjectServices->deleteSubject($id); }

    public function listChaptersWithMasterData(): array
    {
        return [
            'ChapterList' => $this->chapterServices->ChapterList(),
            'Subject' => $this->chapterServices->subject(),
        ];
    }
    public function createChapter(mixed $payload): mixed { return $this->chapterServices->createSubject($payload); }
    public function updateChapter(mixed $payload): mixed { return $this->chapterServices->updateChapter($payload); }
    public function deleteChapter(int|string $id): mixed { return $this->chapterServices->deleteChapter($id); }

    public function listAsheryLeaders(): array { return $this->ashreyLeadeServices->AsheryLeaderList(); }
    public function createAsheryLeader(mixed $payload): mixed { return $this->ashreyLeadeServices->createAsheryLeader($payload); }
    public function updateAsheryLeader(mixed $payload): mixed { return $this->ashreyLeadeServices->updateAsheryLeader($payload); }
    public function deleteAsheryLeader(int|string $id): mixed { return $this->ashreyLeadeServices->deleteAsheryLeader($id); }

    public function listBhaktiBhikshuks(): array { return $this->bhaktiBhikshukService->BhaktiBhikshukList(); }
    public function createBhaktiBhikshuk(mixed $payload): mixed { return $this->bhaktiBhikshukService->createBhaktiBhikshuk($payload); }
    public function updateBhaktiBhikshuk(mixed $payload): mixed { return $this->bhaktiBhikshukService->updateBhaktiVrikshuk($payload); }
    public function deleteBhaktiBhikshuk(int|string $id): mixed { return $this->bhaktiBhikshukService->delete($id); }

    public function listAnnouncements(): array { return $this->announcementService->AnnouncementList(); }
    public function createAnnouncement(mixed $payload): mixed { return $this->announcementService->createAnnouncement($payload); }
    public function updateAnnouncement(mixed $payload): mixed { return $this->announcementService->updateAnnouncement($payload); }
    public function deleteAnnouncement(int|string $id): mixed { return $this->announcementService->deleteAnnouncement($id); }
}
