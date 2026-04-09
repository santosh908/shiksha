<?php

namespace App\Services\BhaktiBhikshukDashboard;
use App\Models\BhaktiBhekshuk;
use Illuminate\Support\Facades\DB;

class BhaktiBhikshukDashboardService
{
    public function getScopedCountsByUserId(int $userId): array
    {
        $bhakti = BhaktiBhekshuk::where('user_id', $userId)->first();
        if (!$bhakti) {
            return [
                'assignedDevoteeCount' => 0,
                'approvedCount' => 0,
                'rejectedCount' => 0,
                'pendingCount' => 0,
            ];
        }

        $latestProfessionalInfoByUser = DB::table('professional_information as pi')
            ->selectRaw('pi.user_id, MAX(pi.id) as id')
            ->groupBy('pi.user_id');

        $baseQuery = DB::table('users as u')
            ->join('user_have_ashray_leader as uhal', 'uhal.user_id', '=', 'u.id')
            ->leftJoinSub($latestProfessionalInfoByUser, 'latest_pi', function ($join) {
                $join->on('latest_pi.user_id', '=', 'u.id');
            })
            ->leftJoin('professional_information as pi', 'pi.id', '=', 'latest_pi.id')
            ->where('u.devotee_type', '=', 'AD')
            ->where('uhal.Bhakti_Bhekshuk', '=', $bhakti->id);

        $assignedDevoteeCount = (clone $baseQuery)
            ->distinct('u.id')
            ->count('u.id');

        $approvedCount = (clone $baseQuery)
            ->where('pi.status_code', '=', 'A')
            ->distinct('u.id')
            ->count('u.id');

        $rejectedCount = (clone $baseQuery)
            ->whereIn('pi.status_code', ['R'])
            ->distinct('u.id')
            ->count('u.id');

        $pendingCount = max($assignedDevoteeCount - $approvedCount - $rejectedCount, 0);

        return [
            'assignedDevoteeCount' => (int) $assignedDevoteeCount,
            'approvedCount' => (int) $approvedCount,
            'rejectedCount' => (int) $rejectedCount,
            'pendingCount' => (int) $pendingCount,
        ];
    }
}
