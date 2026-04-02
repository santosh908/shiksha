<?php
use App\Http\Controllers\Auth\PostRegistrationUserController;
use App\Http\Controllers\Auth\DevoteeExam\DevoteeExamLavelController;
use App\Http\Controllers\Auth\DevoteePromotedLavel\DevoteePromotedLavelController;
use App\Http\Controllers\Auth\Examination\ExaminationController;
use App\Models\Examination\Examination;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\DevoteeDashboard\DevoteeDashboardController;
use Illuminate\Http\Request;

Route::get('/dashboard', function () {
    return Inertia::render('Devotee/dashboard');
});

/*
|--------------------------------------------------------------------------
| Legacy multi-step registration (retired — Phase 5)
| Full profile is collected once at /register. These URLs redirect so old
| bookmarks and posts do not hit obsolete wizard endpoints.
|--------------------------------------------------------------------------
*/
$legacyRegistrationRedirect = static function () {
    return redirect()->to('/Devotee/dashboard')->with(
        'info',
        'Registration is completed in one step when you sign up. Use Profile or Registration summary if you need to review your details.'
    );
};

Route::get('/Registration', $legacyRegistrationRedirect)->name('devotee.registration.legacy');
Route::post('/PersonalInformation', $legacyRegistrationRedirect);
Route::post('/ProfessionalInfo', $legacyRegistrationRedirect);
Route::post('/HearingReading', $legacyRegistrationRedirect);
Route::post('/DevoteeSeminar', $legacyRegistrationRedirect);

Route::Get('/ShikshaLavel', [DevoteeExamLavelController::class, 'getDevoteeExamLavel']);

Route::get('/previewdata', [PostRegistrationUserController::class, 'GetPreviewData']);

Route::get('/PromotedLavel', [DevoteePromotedLavelController::class, 'getDevoteePromotedLavel'])->name('PromotedLavel');

Route::get('/TakeExam/{examId}', [ExaminationController::class, 'TakeExam']);

Route::get('/StartExam/{examId}', [ExaminationController::class, 'StartExam'])->name('StartExam');

Route::post('/SubmitQuestion',[ExaminationController::class, 'SubmitQuestion'])->name('SubmitQuestion');

Route::get('/SubmitQuestion', function(Request $request) {
    $examId = session('current_exam_id');
    if ($examId) {
        return redirect()->route('StartExam', ['examId' => $examId]);
    }
    $previousUrl = url()->previous();
    $pattern = '/\/StartExam\/(\d+)/';
    if (preg_match($pattern, $previousUrl, $matches)) {
        $examId = $matches[1];
        return redirect()->route('StartExam', ['examId' => $examId]);
    }
    return redirect()->route('dashboard'); // Or any other appropriate fallback
})->name('SubmitQuestion.redirect');

Route::post('/FinalizeExam', [ExaminationController::class, 'SaveFinalizeExam']);

Route::get('/queries', [PostRegistrationUserController::class, 'getDevoteeQueries']);

Route::Post('/raisequery', [PostRegistrationUserController::class, 'DevoteeRaiseQuery']);

Route::get('/message', [DevoteeDashboardController::class, 'message'])->name('devotee.message');
Route::post('/message', [DevoteeDashboardController::class, 'messagestore'])->name('devotee.messagestore');

Route::get('/AfterExamSubmission', [ExaminationController::class, 'AfterExamSubmission'])->name('Devotee.AfterExamSubmission');

Route::get('/Profile', function () {
    return Inertia::render('Devotee/Profile');
});