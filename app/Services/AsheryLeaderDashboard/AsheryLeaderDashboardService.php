<?php

namespace App\Services\AsheryLeaderDashboard;
use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\ProfessionalInformation;
use App\Models\User;
class AsheryLeaderDashboardService
{
    public function getTotalCounts($userId)
    {
        $asheryLeader = AsheryLeader::where('user_id', $userId)->first();

        if (!$asheryLeader) {
            return [
                'error' => 'Ashery Leader not found for this user ID'
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
            ->count();

        $approvedevoteeCount = ProfessionalInformation::where('status_code', 'A')
            ->join('user_have_ashray_leader', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->where('user_have_ashray_leader.ashray_leader_code', $leaderCode)
            ->count();

        $notapprovedevoteeCount = ProfessionalInformation::where('status_code', 'S')
            ->join('user_have_ashray_leader', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->where('user_have_ashray_leader.ashray_leader_code', $leaderCode)
            ->count();

        return [
            'bhaktiBhishukCount' => $bhaktiBhishukCount,
            'partiallydevoteeCount' => $partiallydevoteeCount,
            'approvedevoteeCount' => $approvedevoteeCount,
            'notapprovedevoteeCount' => $notapprovedevoteeCount,

        ];
    }
}
