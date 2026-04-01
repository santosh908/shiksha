<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartRegistrationRequest;
use App\Services\DevoteeRegistrationStatus\DevoteeRegistrationStatusService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class DevoteeRegistrationStatusController extends Controller
{
    protected $registrationStatusService;

    public function __construct(DevoteeRegistrationStatusService $registrationStatusService)
    {
        $this->registrationStatusService = $registrationStatusService;
    }

    /**
     * Get the current devotee registration status
     */
    public function getDevoteeRegistrationStatus()
    {
        $result = $this->registrationStatusService->getRegistrationStatus();
        $list = isset($result['registrationList']) ? $result['registrationList'] : [];
        return Inertia::render('Auth/StartRegistration', [
            'registrationList' => $list,
        ]);
    }

    /**
     * Start a new registration period
     */
    public function startRegistration(StartRegistrationRequest $request)
    {
        $result = $this->registrationStatusService->startRegistration($request->validated());
         return redirect()->back()->with('success', 'Registration status  has been saved successfully!');
    }


    /**
     * Close registration
     */
    public function updateRegistrationStatus(StartRegistrationRequest $request, int $id)
    {
        $result = $this->registrationStatusService->updateRegistrationStatus($id, $request->validated());
        return redirect()->back()->with('success', 'Registration status has been updated successfully!');
    }

    /**
     * Delete a registration status
     */
    public function deleteRegistrationStatus(int $id)
    {
        $result = $this->registrationStatusService->deleteRegistrationStatus($id);
         return redirect()->back()->with('success', 'Registration status  has been deleted successfully!');
    }
}
