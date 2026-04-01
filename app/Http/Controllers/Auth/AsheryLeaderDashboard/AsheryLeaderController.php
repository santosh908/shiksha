<?php

namespace App\Http\Controllers\Auth\AsheryLeaderDashboard;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\AsheryLeaderDashboard\AsheryLeaderDashboardService;
use Illuminate\Http\Request;

class AsheryLeaderController extends Controller
{
    protected $AsheryLeaderDashboardService;

    public function __construct()
    {
        $this->AsheryLeaderDashboardService = new AsheryLeaderDashboardService();
    }

    public function asheryleaderdashboard()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }

        $user = Auth::user();

        $counts = $this->AsheryLeaderDashboardService->getTotalCounts($user->id);

        return Inertia::render('AsheryLeader/dashboard', [
            'userName' => $user->name ?? 'AsheryLeader',
            'BhaktiBhishuk' => $counts['bhaktiBhishukCount'],
            'Devotee' => $counts['partiallydevoteeCount'],
            'ApprovedDevotee' => $counts['approvedevoteeCount'],
            'NotApprovedDevotee' => $counts['notapprovedevoteeCount'],
        ]);

    }
}
