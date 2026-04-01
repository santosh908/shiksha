<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class GuestRouteController extends Controller
{
    public function login(Request $request)
    {
        return Inertia::render('Login');
    }

    public function register(Request $request)
    {
        return Inertia::render('Register');
    }

    public function AboutUs(Request $request)
    {
        return Inertia::render('PublicPage/AboutUs');
    }

    public function ShikshaProgram(Request $request)
    {
        return Inertia::render('PublicPage/ShikshaProgram');
    }

    public function OnlineExam(Request $request)
    {
        return Inertia::render('PublicPage/OnlineExam');
    }

    public function faq(Request $request)
    {
        return Inertia::render('PublicPage/faq');
    }

    public function ContactUs(Request $request)
    {
        return Inertia::render('PublicPage/ContactUs');
    }
    
}
