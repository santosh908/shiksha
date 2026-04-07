<?php

namespace App\Http\Controllers\Auth\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\ReportApplicationService;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportApplicationService $reportApplicationService
    ) {
    }

    public function report()
    {
        return inertia('Report/Report');
    }

    public function getReport($type)
    {
        switch ($type) {
            case 'AllDevotee':
                $data = $this->reportApplicationService->allDevotee();
                break;
            case 'NextLevel':
               $data = $this->reportApplicationService->nextLevel();
                break;
            // Add more cases as needed
            default:
                return response()->json(['error' => 'Invalid report type'], 400);
        }

        return response()->json($data);
    }

    
}
