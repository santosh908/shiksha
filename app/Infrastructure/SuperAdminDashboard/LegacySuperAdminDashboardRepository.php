<?php

namespace App\Infrastructure\SuperAdminDashboard;

use App\Domain\SuperAdminDashboard\Contracts\SuperAdminDashboardRepositoryInterface;
use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\ProfessionalInformation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LegacySuperAdminDashboardRepository implements SuperAdminDashboardRepositoryInterface
{
    public function getDashboardCounts(): array
    {
        $asheryLeaderCount = AsheryLeader::where('is_active', 'Y')->count();
        $bhaktiBhishukCount = BhaktiBhekshuk::where('is_active', 'Y')->count();
        $partiallydevoteeCount = User::where('devotee_type', 'AD')
            ->leftJoin('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->where(function ($query) {
                $query->whereNull('professional_information.status_code')
                    ->orWhere('professional_information.status_code', 'N');
            })
            ->count();
        $approvedevoteeCount = ProfessionalInformation::where('status_code', 'A')->count();
        $notapprovedevoteeCount = ProfessionalInformation::where('status_code', 'S')->count();
        $coordinatorCount = User::where('devotee_type', 'CA')->count();

        return [
            'asheryLeaderCount' => $asheryLeaderCount,
            'bhaktiBhishukCount' => $bhaktiBhishukCount,
            'partiallydevoteeCount' => $partiallydevoteeCount,
            'approvedevoteeCount' => $approvedevoteeCount,
            'notapprovedevoteeCount' => $notapprovedevoteeCount,
            'coordinatorCount' => $coordinatorCount,
        ];
    }

    public function getExamLevelStatistics(): array
    {
        $levels = DB::table('shiksha_levels')
            ->whereNotIn('id', [6, 8, 9])
            ->orderBy('id')
            ->get(['id', 'exam_level']);

        return $levels->map(function ($level) {
            $levelId = (int) $level->id;
            $countQuery = DB::table('shiksah_lavel_completed as sc')
                ->join('users', 'users.login_id', '=', 'sc.login_id')
                ->where('sc.is_qualified', 1);
            $this->applyLevelFilter($countQuery, $levelId);

            return [
                'id' => $level->id,
                'exam_level' => $level->exam_level,
                'user_count' => (int) $countQuery->distinct('sc.login_id')->count('sc.login_id'),
            ];
        })->toArray();
    }

    public function getQualifiedUsersForLevel(int|string|null $level = null): array
    {
        $baseQuery = DB::table('shiksah_lavel_completed as sc')
            ->join('users', 'users.login_id', '=', 'sc.login_id')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'sc.shiksha_level')
            ->where('sc.is_qualified', 1);

        $this->applyLevelFilter($baseQuery, $level);

        $baseUsers = $baseQuery
            ->select([
                'sc.login_id',
                'users.name',
                'users.initiated_name',
                'users.email',
                'users.contact_number',
                DB::raw('MAX(sc.exam_date) as exam_date'),
                DB::raw('MAX(sc.total_questions) as total_questions'),
                DB::raw('MAX(sc.is_qualified) as is_qualified'),
                DB::raw('MAX(sc.shiksha_level) as shiksha_level'),
                DB::raw('MIN(shiksha_levels.exam_level) as exam_level'),
            ])
            ->groupBy(
                'sc.login_id',
                'users.name',
                'users.initiated_name',
                'users.email',
                'users.contact_number'
            )
            ->orderBy('exam_date', 'desc')
            ->get();

        if ($baseUsers->isEmpty()) {
            return [];
        }

        $loginIds = $baseUsers->pluck('login_id')->toArray();
        $marksData = DB::table('shiksah_lavel_completed')
            ->whereIn('login_id', $loginIds)
            ->select([
                'login_id',
                'shiksha_level',
                'total_marks',
                'total_obtain',
            ])
            ->get();

        $organizedMarksData = [];
        foreach ($marksData as $mark) {
            $organizedMarksData[$mark->login_id][$mark->shiksha_level] = [
                'total_marks' => $mark->total_marks,
                'total_obtain' => $mark->total_obtain,
            ];
        }

        $levelSummaries = [];
        foreach ($loginIds as $loginId) {
            $userData = $marksData->where('login_id', $loginId);
            $level67Data = $userData->whereIn('shiksha_level', [6, 7]);
            $levelSummaries[$loginId]['6-7'] = [
                'total_marks_sum' => $level67Data->sum('total_marks'),
                'total_obtain_sum' => $level67Data->sum('total_obtain'),
            ];

            $level89Data = $userData->whereIn('shiksha_level', [8, 9]);
            $levelSummaries[$loginId]['8-9'] = [
                'total_marks_sum' => $level89Data->sum('total_marks'),
                'total_obtain_sum' => $level89Data->sum('total_obtain'),
            ];
        }

        return $baseUsers->map(function ($user) use ($organizedMarksData, $levelSummaries) {
            $loginId = $user->login_id;
            $userData = $organizedMarksData[$loginId] ?? [];
            $userLevel = $user->shiksha_level;

            $user->level_6_marks = $userData[6]['total_marks'] ?? null;
            $user->level_7_marks = $userData[7]['total_marks'] ?? null;
            $user->level_8_marks = $userData[8]['total_marks'] ?? null;
            $user->level_9_marks = $userData[9]['total_marks'] ?? null;

            $user->level_6_obtain = $userData[6]['total_obtain'] ?? null;
            $user->level_7_obtain = $userData[7]['total_obtain'] ?? null;
            $user->level_8_obtain = $userData[8]['total_obtain'] ?? null;
            $user->level_9_obtain = $userData[9]['total_obtain'] ?? null;

            if ($userLevel == 6 || $userLevel == 7) {
                $user->total_marks = $levelSummaries[$loginId]['6-7']['total_marks_sum'];
                $user->total_obtain = $levelSummaries[$loginId]['6-7']['total_obtain_sum'];
            } elseif ($userLevel == 8 || $userLevel == 9) {
                $user->total_marks = $levelSummaries[$loginId]['8-9']['total_marks_sum'];
                $user->total_obtain = $levelSummaries[$loginId]['8-9']['total_obtain_sum'];
            } else {
                $user->total_marks = $userData[$userLevel]['total_marks'] ?? null;
                $user->total_obtain = $userData[$userLevel]['total_obtain'] ?? null;
            }

            return (array) $user;
        })->toArray();
    }

    private function applyLevelFilter($query, int|string|null $level): void
    {
        if ($level === null || $level === '') {
            return;
        }

        $level = (int) $level;
        if ($level === 6 || $level === 7) {
            $query->whereIn('sc.shiksha_level', [6, 7]);
            return;
        }

        if ($level === 8 || $level === 9) {
            $query->whereIn('sc.shiksha_level', [8, 9]);
            return;
        }

        $query->where('sc.shiksha_level', $level);
    }
}
