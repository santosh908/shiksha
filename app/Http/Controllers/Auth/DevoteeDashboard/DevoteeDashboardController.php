<?php

namespace App\Http\Controllers\Auth\DevoteeDashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\DevoteeDashboard\DevoteeDashboardService;
use App\Models\User;

class DevoteeDashboardController extends Controller
{
    protected $DevoteeDashboardService;

    public function __construct()
    {
        $this->DevoteeDashboardService = new DevoteeDashboardService();
    }
    public function message(Request $request)
    {
        $user = Auth::user();
        $result = $this->DevoteeDashboardService->showmessage($request, $user->login_id);

        if ($request->has('query_id')) {
            return Inertia::render('Devotee/messages', [
                'messages' => $result['messages'],
                'chatHistory' => $result['chatHistory']
            ]);
        }

        return Inertia::render('Devotee/messages', ['messages' => $result]);
    }

    public function messagestore(Request $request)
    {
        $user = Auth::user();
        $chatHistory = $this->DevoteeDashboardService->storemessage($request);
        return back()->with(['chatHistory' => $chatHistory]);
    }
}
