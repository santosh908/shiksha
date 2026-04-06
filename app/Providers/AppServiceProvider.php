<?php

namespace App\Providers;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;
use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;
use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;
use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Domain\AdminCatalog\Contracts\AdminCatalogRepositoryInterface;
use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;
use App\Infrastructure\AdminCatalog\LegacyAdminCatalogRepository;
use App\Infrastructure\DevoteeApproval\LegacyDevoteeApprovalRepository;
use App\Infrastructure\DevoteeExam\LegacyDevoteeExamRepository;
use App\Infrastructure\DevoteeProfileAdmin\LegacyDevoteeProfileAdminRepository;
use App\Infrastructure\DevoteeModule\LegacyDevoteeModuleRepository;
use App\Infrastructure\ExamAdmin\LegacyExamAdminRepository;
use App\Infrastructure\Registration\EloquentRegistrationRepository;
use App\Infrastructure\SuperAdminDashboard\LegacySuperAdminDashboardRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(RegistrationRepositoryInterface::class, EloquentRegistrationRepository::class);
        $this->app->bind(DevoteeApprovalRepositoryInterface::class, LegacyDevoteeApprovalRepository::class);
        $this->app->bind(DevoteeExamRepositoryInterface::class, LegacyDevoteeExamRepository::class);
        $this->app->bind(DevoteeProfileAdminRepositoryInterface::class, LegacyDevoteeProfileAdminRepository::class);
        $this->app->bind(DevoteeModuleRepositoryInterface::class, LegacyDevoteeModuleRepository::class);
        $this->app->bind(ExamAdminRepositoryInterface::class, LegacyExamAdminRepository::class);
        $this->app->bind(SuperAdminDashboardRepositoryInterface::class, LegacySuperAdminDashboardRepository::class);
        $this->app->bind(AdminCatalogRepositoryInterface::class, LegacyAdminCatalogRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
