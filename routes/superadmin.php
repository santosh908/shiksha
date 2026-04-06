<?php

use Inertia\Inertia;
use App\Http\Controllers\Auth\SuperAdminDashboard\SuperAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [SuperAdminController::class, 'superadmindashboard'])->name('SuperAdmin.dashboard');
Route::get('/message', [SuperAdminController::class, 'message'])->name('SuperAdmin.message');
Route::post('/message', [SuperAdminController::class, 'messagestore'])->name('SuperAdmin.messagestore');
