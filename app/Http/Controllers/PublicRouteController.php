<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Announcement\AnnouncementService;
use Inertia\Inertia;

class PublicRouteController extends Controller
{
    protected $AnnouncementService;
    public function __construct()
    {
        $this->AnnouncementService = new AnnouncementService();
    }
    public function root()
    {
        $list = $this->AnnouncementService->AnnouncementList();
        //dd($list);
        return Inertia::render('Root' ,$list);
    }
}
