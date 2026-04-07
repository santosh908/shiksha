<?php

namespace App\Http\Controllers;

use App\Application\DevoteeModule\DTOs\GetDevoteeModuleDetailsData;
use App\Http\Controllers\Controller;
use App\Services\DevoteeModuleApplicationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevoteeModuleController extends Controller
{
    public function __construct(
        private readonly DevoteeModuleApplicationService $devoteeModuleApplicationService
    )
    {
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
        $data = $this->devoteeModuleApplicationService->list();
        return response()->json($data);
    }

    /**
     * Get full details for a specific devotee.
     */
    public function details($id)
    {
        $data = new GetDevoteeModuleDetailsData((int) $id);
        $details = $this->devoteeModuleApplicationService->details($data);
        if (! $details) {
            return response()->json(['error' => 'Devotee not found'], 404);
        }
        return response()->json($details);
    }
}
