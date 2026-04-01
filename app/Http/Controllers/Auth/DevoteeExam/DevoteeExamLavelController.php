<?php

namespace App\Http\Controllers\Auth\DevoteeExam;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DevoteeExamLevel\DevoteeExamLevelServices;
use Illuminate\Support\Facades\Auth;

class DevoteeExamLavelController extends Controller
{
    protected $examLavel;
    public function __construct()
    {
        $this->examLavel = new DevoteeExamLevelServices();
    }

    function getDevoteeExamLavel()
    {
        $userId = Auth::user()->login_id;
        $list = $this->examLavel->getDevoteeResult($userId); 
        //dd($list);
        return Inertia::render('DevoteeShikshaLevel/devoteeShikshaLevel', ["ShikshaLavel"=>$list]);
    }
}
