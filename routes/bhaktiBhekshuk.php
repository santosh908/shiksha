<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PostRegistrationUserController;
use App\Http\Controllers\Auth\BhaktiBhikshuk\BhaktiBhikshukController;
use App\Http\Controllers\Auth\DevoteeResultList\ResultListController;
use App\Http\Controllers\Auth\SessionResult\SessionResultController;

// Route::get('/dashboard', function () {
//     return Inertia::render('BhaktiBhekshuk/dashboard');
// });

//Route::get('/BhaktiBhikshukDevotee',[PostRegistrationUserController::class, 'getBhaktiBhikshukList']);

//Route::put('/ApproveDevotee/{id}', [PostRegistrationUserController::class, 'ApproveDevotee']);

//Route::put('/ApproveBulkDevotee/{id}', [PostRegistrationUserController::class, 'ApproveBulkDevotee']);

//Route::put('/RejectDevotee/{id}', [PostRegistrationUserController::class, 'RejectDevotee']);

//Route::put('/RejectBulkDevotee/{id}', [PostRegistrationUserController::class, 'RejectBulkDevotee']);

Route::get('/dashboard', [BhaktiBhikshukController::class, 'bhaktibhikshukdashboard'])->name('BhaktiBhekshuk.dashboard');
Route::get('/Profile', [PostRegistrationUserController::class, 'DevoteeProfile'])->name('BhaktiBhekshuk.profile');
Route::post('/UpdatePersonalInformation', [PostRegistrationUserController::class, 'DevoteeUpdatePersonalInfo']);
Route::post('/UpdateSpritualInfoOne', [PostRegistrationUserController::class, 'DevoteeUpdateSpritualInfoOne']);
Route::post('/UpdateSpritualInfoTwo', [PostRegistrationUserController::class, 'DevoteeUpdateSpritualInfoTwo']);
Route::post('/UpdateSpritualInfoThree', [PostRegistrationUserController::class, 'DevoteeUpdateSpritualInfoThree']);


//Route::get('/devoteeresultlist', [ResultListController::class, 'bhaktibhikshukdevoteeresultlist'])->name('BhaktiBhekshuk.devoteeresultlist');

//Route::get('/sessionresultlist/{session?}', [SessionResultController::class, 'bhaktibhikshuksessionresultlist'])->name('BhaktiBhekshuk.sessionresultlist');

