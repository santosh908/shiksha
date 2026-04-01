<?php

namespace App\Http\Controllers\Auth\DevoteePromotedLavel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Examination\Examination;
use App\Models\Examination\ExamSessionModel;
use Inertia\Inertia;
use App\Services\DevoteePromotedLavel\DevoteePromotedLavelServices;
use App\Services\ShikshaLevel\ShikshaLevelServices;

class DevoteePromotedLavelController extends Controller
{
    protected $DevoteePromotedLavelServices;
    protected $ShikshaLevel;

    public function __construct()
    {
        $this->DevoteePromotedLavelServices = new DevoteePromotedLavelServices();
        $this->ShikshaLevel = new ShikshaLevelServices();
    }
    public function getDevoteePromotedLavel()
    {
        $loginID = Auth::user()->login_id;
        $list = $this->DevoteePromotedLavelServices->getDevoteePromotedLavel($loginID);
        $examination = $this->DevoteePromotedLavelServices->getDevoteeExamination($loginID);
       // dd($this->ShikshaLevel->ShikshaLevelListForDevotee());
        return Inertia::render('DevoteePromotedLevel/devoteePromotedLevel', [
            'promotedLevels' => $list,
            'examination' => $examination,
            'ShikshaLevel' => $this->ShikshaLevel->ShikshaLevelListForDevotee(),
        ]);
    }
}
