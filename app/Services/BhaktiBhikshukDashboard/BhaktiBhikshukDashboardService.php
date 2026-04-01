<?php

namespace App\Services\BhaktiBhikshukDashboard;
use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\ProfessionalInformation;
use App\Models\User;
class BhaktiBhikshukDashboardService
{
    public function getTotalCounts()
    {
        // Get the counts from the database
        $asheryLeaderCount = AsheryLeader::where('is_active', 'Y')->count();
        $bhaktiBhishukCount = BhaktiBhekshuk::where('is_active', 'Y')->count();
        // $partiallydevoteeCount = User::where('devotee_type', 'AD')->count();
        $partiallydevoteeCount = User::where('devotee_type', 'AD')
            ->leftJoin('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->whereNull('professional_information.user_id') // This ensures the user has no professional info or mismatched user_id
            ->count();
        $approvedevoteeCount = ProfessionalInformation::where('status_code', 'A')->count();
        $notapprovedevoteeCount = ProfessionalInformation::where('status_code', 'S')->count();
        $coordinatorCount = User::where('devotee_type', 'CA')->count();

        // Return all counts as an array
        return [
            'asheryLeaderCount' => $asheryLeaderCount,
            'bhaktiBhishukCount' => $bhaktiBhishukCount,
            'partiallydevoteeCount' => $partiallydevoteeCount,
            'approvedevoteeCount' => $approvedevoteeCount,
            'notapprovedevoteeCount' => $notapprovedevoteeCount,
            'coordinatorCount' => $coordinatorCount,
        ];
    }
}
