<?php

namespace App\Http\Controllers\Auth\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\Report\ReportServices;

class ReportController extends Controller
{
    protected $reportServices;

    public function __construct()
    {
        $this->reportServices = new reportServices();
    }

    public function report()
    {
        return inertia('Report/Report');
    }

    public function getReport($type)
    {
        switch ($type) {
            case 'AllDevotee':
                $data = $this->reportServices->DevoteeWithALlDetails();
                break;
            case 'NextLevel':
               $data = $this->reportServices->DevoteeNextExamLevel();
                break;
            // Add more cases as needed
            default:
                return response()->json(['error' => 'Invalid report type'], 400);
        }

        return response()->json($data);
    }

    
}
