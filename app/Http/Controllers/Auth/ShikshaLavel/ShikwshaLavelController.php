<?php

namespace App\Http\Controllers\Auth\ShikshaLavel;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ShikshaLavel\ShikshaLavelServices;
use Illuminate\Support\Facades\Auth;

class ShikwshaLavelController extends Controller
{
    protected $shikshaLavel;
    public function __construct()
    {
        $this->shikshaLavel = new ShikshaLavelServices();
    }

    function getDevoteeShikshaLavel()
    {
        $userId = Auth::user()->login_id;
        $List = $this->shikshaLavel->getIntractiveExamResult($userId);
        return Inertia::render('ShikshaLavel/shikshaLavel', 
        ["ResultLists"=>$List]
        );
    }
}
