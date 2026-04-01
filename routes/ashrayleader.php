<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PostRegistrationUserController;
use App\Http\Controllers\Auth\AsheryLeaderDashboard\AsheryLeaderController;
use App\Http\Controllers\Auth\DevoteeResultList\ResultListController;
use App\Http\Controllers\Auth\SessionResult\SessionResultController;

Route::get('/dashboard', function () {
    return Inertia::render('AsheryLeader/dashboard');
});
Route::get('/DevoteeRegistration', [PostRegistrationUserController::class, 'GetRegistrationRequest'])->middleware(['checkPermission:Devotee.GetDevotee']);
Route::get('/dashboard', [AsheryLeaderController::class, 'asheryleaderdashboard'])->name('AsheryLeader.dashboard');
Route::get('/devoteeresultlist', [ResultListController::class, 'asherydevoteeresultlist'])->name('AsheryLeader.devoteeresultlist');
Route::get('/sessionresultlist/{session?}', [SessionResultController::class, 'asheryleadersessionresultlist'])->name('AsheryLeader.sessionresultlist');

