<?php

namespace App\Http\Controllers\Auth\SuperAdminDashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\SuperAdminDashboard\SuperAdminDashboardService;
use App\Services\SuperAdminDashboardApplicationService;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function __construct(
        private readonly SuperAdminDashboardApplicationService $superAdminDashboardApplicationService,
        private readonly SuperAdminDashboardService $superAdminDashboardService,
    ) {
    }

    public function superadmindashboard(Request $request)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }
        $user = Auth::user();
        $counts = $this->superAdminDashboardApplicationService->getDashboardCounts();
        $examLevelStats = $this->superAdminDashboardApplicationService->getExamLevelStatistics();

        $level = $request->input('level');
        // Heavy query: run only when a level is explicitly requested (modal/table fetch).
        $stats = ($level === null || $level === '')
            ? []
            : $this->superAdminDashboardApplicationService->getQualifiedUsersForLevel($level);
        return Inertia::render('SuperAdmin/dashboard', [
            'userName' => $user->name ?? 'SuperAdmin',
            'asheryLeaderCount' => $counts['asheryLeaderCount'],
            'BhaktiBhishuk' => $counts['bhaktiBhishukCount'],
            'Devotee' => $counts['partiallydevoteeCount'],
            'ApprovedDevotee' => $counts['approvedevoteeCount'],
            'NotApprovedDevotee' => $counts['notapprovedevoteeCount'],
            'coordinatorCount' => $counts['coordinatorCount'],
            'examLevelStats' => $examLevelStats,
            'stats' => $stats,
            'devoteeusers' => $stats,
        ]);

    }
    public function message(Request $request)
    {
        $result = $this->superAdminDashboardService->showmessage($request);
        if ($request->has('query_id')) {
            return Inertia::render('SuperAdmin/messages', [
                'messages' => $result['messages'],
                'chatHistory' => $result['chatHistory']
            ]);
        }

        return Inertia::render('SuperAdmin/messages', ['messages' => $result]);
    }

    public function messagestore(Request $request)
    {
        $chatHistory = $this->superAdminDashboardService->storemessage($request);
        return back()->with(['chatHistory' => $chatHistory]);
    }

}
