<?php

namespace App\Infrastructure\AsheryLeaderDashboard;

use App\Domain\AsheryLeaderDashboard\Contracts\AsheryLeaderDashboardRepositoryInterface;
use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\ProfessionalInformation;
use App\Models\User;

class LegacyAsheryLeaderDashboardRepository implements AsheryLeaderDashboardRepositoryInterface
{
    public function countsByUserId(int $userId): array
    {
        $asheryLeader = AsheryLeader::where('user_id', $userId)->first();
        if (! $asheryLeader) {
            return [
                'bhaktiBhishukCount' => 0,
                'partiallydevoteeCount' => 0,
                'approvedevoteeCount' => 0,
                'notapprovedevoteeCount' => 0,
            ];
        }

        $leaderCode = $asheryLeader->code;

        $bhaktiBhishukCount = BhaktiBhekshuk::where('is_active', 'Y')
            ->where('ashray_leader_code', $leaderCode)
            ->count();

        $partiallydevoteeCount = User::where('devotee_type', 'AD')
            ->leftJoin('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('user_have_ashray_leader', 'users.id', '=', 'user_have_ashray_leader.user_id')
            ->where('user_have_ashray_leader.ashray_leader_code', $leaderCode)
            ->where(function ($query) {
                $query->whereNull('professional_information.status_code')
                    ->orWhere('professional_information.status_code', 'N');
            })
            ->distinct('users.id')
            ->count('users.id');

        $approvedevoteeCount = ProfessionalInformation::where('status_code', 'A')
            ->join('user_have_ashray_leader', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->where('user_have_ashray_leader.ashray_leader_code', $leaderCode)
            ->distinct('professional_information.user_id')
            ->count('professional_information.user_id');

        $notapprovedevoteeCount = ProfessionalInformation::where('status_code', 'S')
            ->join('user_have_ashray_leader', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->where('user_have_ashray_leader.ashray_leader_code', $leaderCode)
            ->distinct('professional_information.user_id')
            ->count('professional_information.user_id');

        return [
            'bhaktiBhishukCount' => $bhaktiBhishukCount,
            'partiallydevoteeCount' => $partiallydevoteeCount,
            'approvedevoteeCount' => $approvedevoteeCount,
            'notapprovedevoteeCount' => $notapprovedevoteeCount,
        ];
    }
}

