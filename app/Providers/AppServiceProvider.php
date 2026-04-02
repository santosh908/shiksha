<?php

namespace App\Providers;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;
use App\Domain\DevoteeExam\Contracts\DevoteeExamRepositoryInterface;
use App\Domain\ExamAdmin\Contracts\ExamAdminRepositoryInterface;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Infrastructure\DevoteeApproval\LegacyDevoteeApprovalRepository;
use App\Infrastructure\DevoteeExam\LegacyDevoteeExamRepository;
use App\Infrastructure\ExamAdmin\LegacyExamAdminRepository;
use App\Infrastructure\Registration\EloquentRegistrationRepository;
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
        $this->app->bind(ExamAdminRepositoryInterface::class, LegacyExamAdminRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
