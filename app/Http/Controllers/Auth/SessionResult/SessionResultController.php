<?php

namespace App\Http\Controllers\Auth\SessionResult;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SessionResultApplicationService;
use App\Services\EncryptionService\EncryptionServices;
use Inertia\Inertia;
class SessionResultController extends Controller
{
    public function __construct(
        private readonly SessionResultApplicationService $sessionResultApplicationService
    ) {
    }
    public function sessionresultlist($session = null)
    {
        $decryptedSession = $session ? EncryptionServices::decrypt($session) : null;
        //dd($decryptedSession);
        $list = $decryptedSession ? $this->sessionResultApplicationService->list($decryptedSession) : [];
        //dd($list);
        $examSessions = $this->sessionResultApplicationService->sessions();
        //dd($examSessions);
        return Inertia::render('SuperAdmin/sessionresult', [
            'devoteeResults' => $list,
            'examSessions' => $examSessions,
            'currentSession' => $decryptedSession,
        ]);
    }

    public function asheryleadersessionresultlist($session = null)
    {
        //dd($session);
        $list = $session ? $this->sessionResultApplicationService->listForAshrayLeader($session) : [];
        //dd($list);
        $examSessions = $this->sessionResultApplicationService->sessions();
        //dd($examSessions);
        return Inertia::render('AsheryLeader/sessionresult', [
            'devoteeResults' => $list,
            'examSessions' => $examSessions,
            'currentSession' => $session,
        ]);
    }

    public function bhaktibhikshuksessionresultlist($session = null)
    {
        //dd($session);
        $list = $session ? $this->sessionResultApplicationService->listForBhaktiVriksha($session) : [];
        //dd($list);
        $examSessions = $this->sessionResultApplicationService->sessions();
        //dd($examSessions);
        return Inertia::render('BhaktiBhekshuk/sessionresult', [
            'devoteeResults' => $list,
            'examSessions' => $examSessions,
            'currentSession' => $session,
        ]);
    }
}
