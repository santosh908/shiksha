<?php

namespace App\Providers;

use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Infrastructure\DevoteeApproval\LegacyDevoteeApprovalRepository;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
