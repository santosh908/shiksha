<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicRouteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\GuestRouteController;
use App\Http\Controllers\Auth\Announcement\AnnouncementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// public routes
Route::get('/', [PublicRouteController::class, 'root'])->name('root');

// guest routes
Route::group(['middleware' => 'guest'], function () {
    Route::get('/login', [GuestRouteController::class, 'login'])->name('guest.login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('guest.login');
    Route::get('/register', [GuestRouteController::class, 'register'])->name('guest.register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::get('/about-us', [GuestRouteController::class, 'AboutUs']);
    Route::get('/ShikshaProgram', [GuestRouteController::class, 'ShikshaProgram']);
    Route::get('/faq', [GuestRouteController::class, 'faq']);
    Route::get('/contact-us', [GuestRouteController::class, 'ContactUs']);

    /*Forgot Password Rote*/
    Route::get('/forgotPassword', [PasswordResetLinkController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('/forgotPassword', [PasswordResetLinkController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetLinkController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetLinkController::class, 'resetPassword'])->name('password.update');
    Route::get('/announcementdescription', [GuestRouteController::class, 'AnnouncementDescription']);

    Route::get('/latest-announcement/{id}', [AnnouncementController::class, 'getAnnouncementsDescription']);
    Route::get('/archive', [AnnouncementController::class, 'getOldDescription']);
    //Route::get('/archive/{id}', [AnnouncementController::class, 'ArchiveByID']);


});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});



// role based  
Route::group(['middleware' => ['role:Devotee'], 'prefix' => 'Devotee'], function () {
    require __DIR__ . '/devotee.php';
});

Route::group(['middleware' => ['role:CoOrdinator'], 'prefix' => 'CoOrdinator'], function () {
    require __DIR__ . '/coordinator.php';
});

Route::group(['middleware' => ['role:AsheryLeader'], 'prefix' => 'AsheryLeader'], function () {
    require __DIR__ . '/ashrayleader.php';
});

Route::group(['middleware' => ['role:BhaktiBhekshuk'], 'prefix' => 'BhaktiBhekshuk'], function () {
    require __DIR__ . '/bhaktiBhekshuk.php';
});

Route::group(['middleware' => ['role:SuperAdmin'], 'prefix' => 'SuperAdmin'], function () {
    require __DIR__ . '/superadmin.php';
});

Route::group(['prefix' => 'Action'], function () {
    require __DIR__ . '/action.php';
});

require __DIR__ . '/auth.php';
require __DIR__ .'/exp.php';