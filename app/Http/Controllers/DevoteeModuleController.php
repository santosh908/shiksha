<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Report\ReportServices; // Assuming we reuse this valid logic
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // For raw queries/view access if needed directly

class DevoteeModuleController extends Controller
{
    protected $reportServices;

    public function __construct(ReportServices $reportServices)
    {
        $this->reportServices = $reportServices;
    }

    /**
     * Display the main view for the Devotee Module.
     */
    public function index()
    {
        return Inertia::render('DevoteeModule/DevoteeList');
    }

    /**
     * Get the list of devotees with next exam level.
     * Reuses the logic from ReportServices::DevoteeNextExamLevel
     */
    public function list()
    {
        // Leverage existing service logic which already fetches from the view and calculates next level
        $data = $this->reportServices->DevoteeVewProfile();
        return response()->json($data);
    }

    /**
     * Get full details for a specific devotee.
     */
    public function details($id)
    {
        $devotee = DB::table('devotee_with_all_details_view')
            ->where('prid', $id)
            ->first();

        if (!$devotee) {
            return response()->json(['error' => 'Devotee not found'], 404);
        }

        $examLevels = $this->reportServices->getDevoteeExamLevels($devotee->login_id);

        return response()->json([
            'personal_details' => $devotee,
            'exam_details' => $examLevels
        ]);
    }
}
