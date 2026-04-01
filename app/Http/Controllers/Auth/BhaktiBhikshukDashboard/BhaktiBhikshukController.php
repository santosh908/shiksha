<?php

namespace App\Http\Controllers\Auth\BhaktiBhikshukDashboard;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\BhaktiBhikshukDashboard\BhaktiBhikshukDashboardService;

class BhaktiBhikshukController extends Controller
{
    protected $BhaktiBhikshukDashboardService;

    public function __construct()
    {
        $this->BhaktiBhikshukDashboardService = new BhaktiBhikshukDashboardService();
    }

    public function bhaktibhikshukdashboard()
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }

        $user = Auth::user();

        $counts = $this->BhaktiBhikshukDashboardService->getTotalCounts();
        return Inertia::render('AsheryLeader/dashboard', [
            'userName' => $user->name ?? 'BhaktiBhikshuk',
            'asheryLeaderCount' => $counts['asheryLeaderCount'],
            'BhaktiBhishuk' => $counts['bhaktiBhishukCount'],
            'Devotee' => $counts['partiallydevoteeCount'],
            'ApprovedDevotee' => $counts['approvedevoteeCount'],
            'NotApprovedDevotee' => $counts['notapprovedevoteeCount'],
            'coordinatorCount' => $counts['coordinatorCount'],
        ]);

    }
}
