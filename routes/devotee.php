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

Route::get('/Registration', [PostRegistrationUserController::class, 'index']);

Route::post('/PersonalInformation', [PostRegistrationUserController::class, 'storePersonalInfo']);

Route::Post('/ProfessionalInfo', [PostRegistrationUserController::class, 'StoreProfessionalInfo']);

Route::Post('/HearingReading', [PostRegistrationUserController::class, 'StoreHearingReading']);

Route::Post('/DevoteeSeminar', [PostRegistrationUserController::class, 'StoreDevoteeSeminar']);

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