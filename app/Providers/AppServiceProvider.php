<?php

namespace App\Providers;

use App\Domain\AsheryLeaderDashboard\Contracts\AsheryLeaderDashboardRepositoryInterface;
use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;
use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;
use App\Domain\DevoteeProfileAdmin\Contracts\DevoteeProfileAdminRepositoryInterface;
use App\Domain\DevoteePostRegistration\Contracts\DevoteePostRegistrationRepositoryInterface;
use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;
use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Domain\AdminCatalog\Contracts\AdminCatalogRepositoryInterface;
use App\Domain\ChangePassword\Contracts\ChangePasswordRepositoryInterface;
use App\Domain\BhaktiBhikshuk\Contracts\BhaktiBhikshukRepositoryInterface;
use App\Domain\DevoteePromotedLevel\Contracts\DevoteePromotedLevelRepositoryInterface;
use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;
use App\Domain\QuestionBank\Contracts\QuestionBankRepositoryInterface;
use App\Domain\ShikshaAppUser\Contracts\ShikshaAppUserRepositoryInterface;
use App\Domain\ResultManagement\Contracts\ResultManagementRepositoryInterface;
use App\Domain\ResultList\Contracts\ResultListRepositoryInterface;
use App\Domain\SessionResult\Contracts\SessionResultRepositoryInterface;
use App\Domain\Report\Contracts\ReportRepositoryInterface;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;
use App\Infrastructure\AdminCatalog\LegacyAdminCatalogRepository;
use App\Infrastructure\AsheryLeaderDashboard\LegacyAsheryLeaderDashboardRepository;
use App\Infrastructure\ChangePassword\LegacyChangePasswordRepository;
use App\Infrastructure\BhaktiBhikshuk\LegacyBhaktiBhikshukRepository;
use App\Infrastructure\DevoteePromotedLevel\LegacyDevoteePromotedLevelRepository;
use App\Infrastructure\DevoteeApproval\LegacyDevoteeApprovalRepository;
use App\Infrastructure\DevoteeExam\LegacyDevoteeExamRepository;
use App\Infrastructure\DevoteeProfileAdmin\LegacyDevoteeProfileAdminRepository;
use App\Infrastructure\DevoteePostRegistration\LegacyDevoteePostRegistrationRepository;
use App\Infrastructure\DevoteeModule\LegacyDevoteeModuleRepository;
use App\Infrastructure\ExamAdmin\LegacyExamAdminRepository;
use App\Infrastructure\Registration\EloquentRegistrationRepository;
use App\Infrastructure\SuperAdminDashboard\LegacySuperAdminDashboardRepository;
use App\Infrastructure\ShikshaLevel\LegacyShikshaLevelRepository;
use App\Domain\ShikshaLevel\Contracts\ShikshaLevelRepositoryInterface;
use App\Infrastructure\QuestionBank\LegacyQuestionBankRepository;
use App\Infrastructure\ShikshaAppUser\LegacyShikshaAppUserRepository;
use App\Infrastructure\ResultManagement\LegacyResultManagementRepository;
use App\Infrastructure\ResultList\LegacyResultListRepository;
use App\Infrastructure\SessionResult\LegacySessionResultRepository;
use App\Infrastructure\Report\LegacyReportRepository;
use App\Infrastructure\ExamOps\LegacyExamOpsRepository;
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
        $this->app->bind(DevoteePostRegistrationRepositoryInterface::class, LegacyDevoteePostRegistrationRepository::class);
        $this->app->bind(DevoteeModuleRepositoryInterface::class, LegacyDevoteeModuleRepository::class);
        $this->app->bind(ExamAdminRepositoryInterface::class, LegacyExamAdminRepository::class);
        $this->app->bind(SuperAdminDashboardRepositoryInterface::class, LegacySuperAdminDashboardRepository::class);
        $this->app->bind(AdminCatalogRepositoryInterface::class, LegacyAdminCatalogRepository::class);
        $this->app->bind(ChangePasswordRepositoryInterface::class, LegacyChangePasswordRepository::class);
        $this->app->bind(BhaktiBhikshukRepositoryInterface::class, LegacyBhaktiBhikshukRepository::class);
        $this->app->bind(DevoteePromotedLevelRepositoryInterface::class, LegacyDevoteePromotedLevelRepository::class);
        $this->app->bind(ShikshaLevelRepositoryInterface::class, LegacyShikshaLevelRepository::class);
        $this->app->bind(QuestionBankRepositoryInterface::class, LegacyQuestionBankRepository::class);
        $this->app->bind(ShikshaAppUserRepositoryInterface::class, LegacyShikshaAppUserRepository::class);
        $this->app->bind(ResultManagementRepositoryInterface::class, LegacyResultManagementRepository::class);
        $this->app->bind(ResultListRepositoryInterface::class, LegacyResultListRepository::class);
        $this->app->bind(SessionResultRepositoryInterface::class, LegacySessionResultRepository::class);
        $this->app->bind(ReportRepositoryInterface::class, LegacyReportRepository::class);
        $this->app->bind(ExamOpsRepositoryInterface::class, LegacyExamOpsRepository::class);
        $this->app->bind(AsheryLeaderDashboardRepositoryInterface::class, LegacyAsheryLeaderDashboardRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
