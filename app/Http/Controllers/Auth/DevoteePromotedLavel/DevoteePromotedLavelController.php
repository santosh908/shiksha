<?php

namespace App\Http\Controllers\Auth\DevoteePromotedLavel;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\DevoteePromotedLevelApplicationService;

class DevoteePromotedLavelController extends Controller
{
    public function __construct(
        private readonly DevoteePromotedLevelApplicationService $devoteePromotedLevelApplicationService
    ) {
    }

    public function getDevoteePromotedLavel()
    {
        $loginID = (string) (Auth::user()->login_id ?? '');
        $list = $this->devoteePromotedLevelApplicationService->promotedLevelsByLoginId($loginID);
        $examination = $this->devoteePromotedLevelApplicationService->availableExaminationsByLoginId($loginID);

        return Inertia::render('DevoteePromotedLevel/devoteePromotedLevel', [
            'promotedLevels' => $list,
            'examination' => $examination,
            'ShikshaLevel' => $this->devoteePromotedLevelApplicationService->shikshaLevelsForDevotee(),
        ]);
    }
}
