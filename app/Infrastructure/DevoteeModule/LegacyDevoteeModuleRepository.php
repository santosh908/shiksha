<?php

namespace App\Infrastructure\DevoteeModule;

use App\Domain\DevoteeModule\Contracts\DevoteeModuleRepositoryInterface;
use App\Services\Report\ReportServices;
use Illuminate\Support\Facades\DB;

class LegacyDevoteeModuleRepository implements DevoteeModuleRepositoryInterface
{
    public function __construct(
        private readonly ReportServices $reportServices
    ) {
    }

    public function list(): array
    {
        return $this->reportServices->DevoteeVewProfile();
    }

    public function details(int|string $id): ?array
    {
        $devotee = DB::table('devotee_with_all_details_view')
            ->where('prid', $id)
            ->first();

        if (! $devotee) {
            return null;
        }

        return [
            'personal_details' => (array) $devotee,
            'exam_details' => $this->reportServices->getDevoteeExamLevels($devotee->login_id),
        ];
    }
}
