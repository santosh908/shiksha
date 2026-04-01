<?php

namespace App\Http\Controllers\Auth\SessionResult;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SessionResult\SessionResultServices;
use App\Services\EncryptionService\EncryptionServices;
use Inertia\Inertia;
class SessionResultController extends Controller
{
    protected $SessionResultServices;

    public function __construct()
    {
        $this->SessionResultServices = new SessionResultServices();
    }
    public function sessionresultlist($session = null)
    {
        $decryptedSession = $session ? EncryptionServices::decrypt($session) : null;
        //dd($decryptedSession);
        $list = $decryptedSession ? $this->SessionResultServices->getSessionResultList($decryptedSession) : [];
        //dd($list);
        $examSessions = $this->SessionResultServices->ExamSessionList();
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
        $list = $session ? $this->SessionResultServices->getAsherySessionResultList($session) : [];
        //dd($list);
        $examSessions = $this->SessionResultServices->ExamSessionList();
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
        $list = $session ? $this->SessionResultServices->getBhaktiBhikshukSessionResultList($session) : [];
        //dd($list);
        $examSessions = $this->SessionResultServices->ExamSessionList();
        //dd($examSessions);
        return Inertia::render('BhaktiBhekshuk/sessionresult', [
            'devoteeResults' => $list,
            'examSessions' => $examSessions,
            'currentSession' => $session,
        ]);
    }
}
