<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRegistrationRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Services\RegistrationService;
use App\Services\DevoteeRegistrationStatus\DevoteeRegistrationStatusService;
use Inertia\Inertia;
use App\Models\User;
use Inertia\Response;
use App\Jobs\SendRegistrationMailJob;

class RegisteredUserController extends Controller
{
    protected $registrationService;
    protected $rgStatus;

    public function __construct(RegistrationService $rService,DevoteeRegistrationStatusService  $RegistrationStatusService)
    {
        $this->registrationService = $rService;
        $this->rgStatus = $RegistrationStatusService;
    }
    /**
     * Display the registration view.  
     */
    public function create(): Response
    {
        $rgStatus = $this->rgStatus->registrationIsOpen();
        $masterData = $this->registrationService->getRegistrationMasterData();
        return Inertia::render('Auth/Register',[
            'registrationIsOpen' => $rgStatus,
            'masterData' => $masterData,
        ]);
    }


    public function store(UserRegistrationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->relation_type === 'relative' && !User::where('login_id', $request->relative_login_id)->exists()) {
            return redirect()->back()->withErrors(['relative_login_id' => 'The specified Login ID does not exist in our database.']);
        }
        $registrationData = $this->registrationService->mapRequestToRegistrationData($data);
        $user = $this->registrationService->createUser($registrationData);
        $user->assignRole('Devotee');
        $userType = $user->devotee_type;
        if ($userType == "AD") {
            return redirect()->route('register')->with('success', 'Your complete registration has been submitted successfully. Please wait for leader approval.');
        } else {
            return redirect()->route('register')->with('success', 'Your registration request has been successfully submitted. Please wait for approval.');
        }
    }
}
