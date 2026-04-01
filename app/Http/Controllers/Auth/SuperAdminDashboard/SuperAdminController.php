<?php

namespace App\Http\Controllers\Auth\SuperAdminDashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\SuperAdminDashboard\SuperAdminDashboardService;
use Illuminate\Http\Request;
use App\Models\Examination\Examination;
use App\Models\Examination\ExamSessionModel;
use App\Models\ExamLavelCompleted;

class SuperAdminController extends Controller
{
    protected $SuperAdminDashboardService;

    public function __construct()
    {
        $this->SuperAdminDashboardService = new SuperAdminDashboardService();
    }

    public function superadmindashboard(Request $request)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }
        $user = Auth::user();
        $counts = $this->SuperAdminDashboardService->getTotalCounts();
        $examLevelStats = $this->SuperAdminDashboardService->getExamLevelStatistics();

        $level = $request->query('level');
        $stats = $this->SuperAdminDashboardService->getQualifiedUsersForLevelOne($level);
       // dd($stats);
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
        $result = $this->SuperAdminDashboardService->showmessage($request);
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
        $chatHistory = $this->SuperAdminDashboardService->storemessage($request);
        return back()->with(['chatHistory' => $chatHistory]);
    }

}
