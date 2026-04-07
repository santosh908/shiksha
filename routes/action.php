<?php

use Inertia\Inertia;
use App\Http\Controllers\Auth\QuestionBank\QuestionBankController;
use App\Http\Controllers\Auth\Book\BookController;
use App\Http\Controllers\Auth\Education\EducationController;
use App\Http\Controllers\Auth\Seminar\SeminarController;
use App\Http\Controllers\Auth\Memorisedprayers\MemorisedprayersController;
use App\Http\Controllers\Auth\MeritalStatus\MeritalstatusController;
use App\Http\Controllers\Auth\Profession\ProfessionController;
use App\Http\Controllers\Auth\AsheryLeader\AsheryLeaderController;
use App\Http\Controllers\Auth\Announcement\AnnouncementController;
use App\Http\Controllers\Auth\Examination\ExaminationController;
use App\Http\Controllers\Auth\PostRegistrationUserController;
use App\Http\Controllers\Auth\BhaktiBhikshuk\BhaktiBhikshukController;
use App\Http\Controllers\Auth\ChangePassword\ChangePasswordController;
use App\Http\Controllers\Auth\ShikshaAppUser\ShikshaAppUserController;
use App\Http\Controllers\Auth\Subject\SubjectController;
use App\Http\Controllers\Auth\ShikshaLevel\ShikshaLevelController;
use App\Http\Controllers\Auth\DevoteeResultList\ResultListController;
use App\Http\Controllers\Auth\SessionResult\SessionResultController;
use App\Http\Controllers\Auth\Chapter\ChapterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Report\ReportController;
use App\Http\Controllers\DevoteeRegistrationStatusController;

Route::get('/questionbank', [QuestionBankController::class, 'questionbank'])->name('Action.questionbank')->middleware(['checkPermission:Question.questionbank']);
Route::post('/questionbank', [QuestionBankController::class, 'questionbankStore'])->name('Action.QuestionStore')->middleware(['checkPermission:Question.QuestionStore']);
Route::get('/questionbank/edit/{questionbank}', [QuestionBankController::class, 'edit'])->name('questionbank.edit')->middleware(['checkPermission:Question.edit']);
Route::put('/questionbank/{questionbank}', [QuestionBankController::class, 'update'])->name('questionbank.update')->middleware(['checkPermission:Question.update']);
Route::delete('/questionbank/{questionbank}', [QuestionBankController::class, 'destroy'])->name('questionbank.destroy')->middleware(['checkPermission:Question.destroy']);
Route::get('/questionbank/view/{questionbank}', [QuestionBankController::class, 'view'])->name('questionbank.view')->middleware(['checkPermission:Question.view']);

Route::get('/addquestion', [QuestionBankController::class, 'addQuestion'])->name('Action.addquestion')->middleware(['checkPermission:AddQuestion.addQuestion']);
Route::get('/filter-questions', [QuestionBankController::class, 'filterQuestions'])->name('Action.addquestion')->middleware(['checkPermission:FilterQuestion.filterQuestions']);
Route::post('/filter-questions', [QuestionBankController::class, 'filterQuestions'])->name('Action.filterQuestions')->middleware(['checkPermission:FilterQuestion.filterQuestions']);
Route::post('/add-questions-to-exams', [QuestionBankController::class, 'addQuestionsToExams'])->name('Action.addQuestionsToExams')->middleware(['checkPermission:AddQuetionToExam.addQuestionsToExams']);
Route::delete('/remove-questions-from-exams/{question}', [QuestionBankController::class, 'removeQuestion'])->name('addquestion.removeQuestion')->middleware(['checkPermission:RemoveQuestion.removeQuestion']);


Route::get('/book', [BookController::class, 'bookList'])->name('Action.book')->middleware(['checkPermission:Book.bookList']);
Route::post('/book', [BookController::class, 'bookStore'])->name('Action.BookStore')->middleware(['checkPermission:Book.bookStore']);
Route::get('/book/edit/{book}', [BookController::class, 'edit'])->name('book.edit')->middleware(['checkPermission:Book.edit']);
Route::put('/book/{book}', [BookController::class, 'update'])->name('book.update')->middleware(['checkPermission:Book.update']);
Route::get('/book/view/{book}', [BookController::class, 'view'])->name('book.view')->middleware(['checkPermission:Book.view']);
Route::delete('/book/{book}', [BookController::class, 'destroy'])->name('book.destroy')->middleware(['checkPermission:Book.destroy']);

Route::get('/education', [EducationController::class, 'education'])->name('Action.education')->middleware(['checkPermission:Education.education']);
Route::post('/education', [EducationController::class, 'educationStore'])->name('Action.EducationStore')->middleware(['checkPermission:Education.educationStore']);
Route::get('/education/edit/{education}', [EducationController::class, 'edit'])->name('education.edit')->middleware(['checkPermission:Education.edit']);
Route::put('/education/{education}', [EducationController::class, 'update'])->name('education.update')->middleware(['checkPermission:Education.update']);
Route::get('/education/view/{education}', [EducationController::class, 'view'])->name('education.view')->middleware(['checkPermission:Education.view']);
Route::delete('/education/{education}', [EducationController::class, 'destroy'])->name('education.destroy')->middleware(['checkPermission:Education.destroy']);

Route::get('/seminar', [SeminarController::class, 'seminar'])->name('Action.seminar')->name('education.destroy')->middleware(['checkPermission:Seminar.seminar']);
Route::post('/seminar', [SeminarController::class, 'seminarStore'])->name('Action.SeminarStore')->name('education.destroy')->middleware(['checkPermission:Seminar.seminarStore']);
Route::get('/seminar/edit/{seminar}', [SeminarController::class, 'edit'])->name('seminar.edit')->name('education.destroy')->middleware(['checkPermission:Seminar.edit']);
Route::put('/seminar/{seminar}', [SeminarController::class, 'update'])->name('seminar.update')->name('education.destroy')->middleware(['checkPermission:Seminar.update']);
Route::get('/seminar/view/{seminar}', [SeminarController::class, 'view'])->name('seminar.view')->name('education.destroy')->middleware(['checkPermission:Seminar.view']);
Route::delete('/seminar/{seminar}', [SeminarController::class, 'destroy'])->name('seminar.destroy')->name('education.destroy')->middleware(['checkPermission:Seminar.destroy']);

Route::get('/meritalstatus', [MeritalstatusController::class, 'meritalstatus'])->name('Action.meritalstatus')->middleware(['checkPermission:meritalstatus.meritalstatus']);
Route::post('/meritalstatus', [MeritalstatusController::class, 'meritalstatusStore'])->name('Action.MeritalStatusStore')->middleware(['checkPermission:meritalstatus.meritalstatusStore']);
Route::get('/meritalstatus/edit/{meritalstatus}', [MeritalstatusController::class, 'edit'])->name('meritalstatus.edit')->middleware(['checkPermission:meritalstatus.edit']);
Route::put('/meritalstatus/{meritalstatus}', [MeritalstatusController::class, 'update'])->name('meritalstatus.update')->middleware(['checkPermission:meritalstatus.update']);
Route::get('/meritalstatus/view/{meritalstatus}', [MeritalstatusController::class, 'view'])->name('meritalstatus.view')->middleware(['checkPermission:meritalstatus.view']);
Route::delete('/meritalstatus/{meritalstatus}', [MeritalstatusController::class, 'destroy'])->name('meritalstatus.destroy')->middleware(['checkPermission:meritalstatus.destroy']);

Route::get('/profession', [ProfessionController::class, 'profession'])->name('Action.profession')->middleware(['checkPermission:profession.profession']);
Route::post('/profession', [ProfessionController::class, 'professionStore'])->name('Action.ProfessionStore')->middleware(['checkPermission:profession.professionStore']);
Route::get('/profession/edit/{profession}', [ProfessionController::class, 'edit'])->name('profession.edit')->middleware(['checkPermission:profession.edit']);
Route::put('/profession/{profession}', [ProfessionController::class, 'update'])->name('profession.update')->middleware(['checkPermission:profession.update']);
Route::get('/profession/view/{profession}', [ProfessionController::class, 'view'])->name('profession.view')->middleware(['checkPermission:profession.view']);
Route::delete('/profession/{profession}', [ProfessionController::class, 'destroy'])->name('profession.destroy')->middleware(['checkPermission:profession.destroy']);

Route::get('/prayers', [MemorisedprayersController::class, 'prayers'])->name('Action.prayers')->middleware(['checkPermission:prayers.prayers']);
Route::post('/prayers', [MemorisedprayersController::class, 'prayersStore'])->name('Action.PrayersStore')->middleware(['checkPermission:prayers.prayersStore']);
Route::get('/prayers/edit/{prayers}', [MemorisedprayersController::class, 'edit'])->name('prayers.edit')->middleware(['checkPermission:prayers.edit']);
Route::put('/prayers/{prayers}', [MemorisedprayersController::class, 'update'])->name('prayers.update')->middleware(['checkPermission:prayers.update']);
Route::get('/prayers/view/{prayers}', [MemorisedprayersController::class, 'view'])->name('prayers.view')->middleware(['checkPermission:prayers.view']);
Route::delete('/prayers/{prayers}', [MemorisedprayersController::class, 'destroy'])->name('prayers.destroy')->middleware(['checkPermission:prayers.destroy']);

Route::get('/announcement', [AnnouncementController::class, 'announcement'])->name('Action.announcement')->middleware(['checkPermission:announcement.announcement']);
Route::post('/announcement', [AnnouncementController::class, 'announcementStore'])->name('Action.AnnouncementStore')->middleware(['checkPermission:announcement.announcementStore']);
Route::get('/announcement/edit/{announcement}', [AnnouncementController::class, 'edit'])->name('announcement.edit')->middleware(['checkPermission:announcement.edit']);
Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update')->middleware(['checkPermission:announcement.update']);
Route::get('/announcement/view/{announcement}', [AnnouncementController::class, 'view'])->name('announcement.view')->middleware(['checkPermission:announcement.view']);
Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy')->middleware(['checkPermission:announcement.destroy']);

Route::get('/ExamSession', [ExaminationController::class, 'exam_session'])->name('Action.ExamSession')->middleware(['checkPermission:ExamSession.exam_session']);
Route::post('/ExamSession', [ExaminationController::class, 'exam_session_store'])->name('Action.exam_session_store')->middleware(['checkPermission:ExamSession.exam_session_store']);
Route::put('/ExamSession/{ExamSession}', [ExaminationController::class, 'session_edit'])->name('Action.UpdateExamSession')->middleware(['checkPermission:ExamSession.session_edit']);
Route::delete('/ExamSession/{ExamSession}', [ExaminationController::class, 'deleteExamSession'])->name('Action.DeleteExamSesion')->middleware(['checkPermission:ExamSession.deleteExamSession']);

Route::get('/examination', [ExaminationController::class, 'examination'])->name('Action.examination')->middleware(['checkPermission:examination.examination']);
Route::post('/examination', [ExaminationController::class, 'examinationStore'])->name('Action.ExaminationStore')->middleware(['checkPermission:examination.examinationStore']);
Route::get('/examination/edit/{examination}', [ExaminationController::class, 'edit'])->name('examination.edit')->middleware(['checkPermission:examination.edit']);
Route::put('/examination/{examination}', [ExaminationController::class, 'update'])->name('examination.update')->middleware(['checkPermission:examination.update']);
Route::get('/examination/view/{examination}', [ExaminationController::class, 'view'])->name('examination.view')->middleware(['checkPermission:examination.view']);
Route::delete('/examination/{examination}', [ExaminationController::class, 'destroy'])->name('examination.destroy')->middleware(['checkPermission:examination.destroy']);

Route::get('/devoteeList', [PostRegistrationUserController::class, 'GetSuperAdminDevoteeList'])->middleware(['checkPermission:devoteeList.GetSuperAdminDevoteeList']);
Route::put('/ApproveDevotee/{id}', [PostRegistrationUserController::class, 'ApproveDevotee'])->middleware(['checkPermission:ApproveDevotee.ApproveDevotee']);
Route::put('/ApproveBulkDevotee/{id}', [PostRegistrationUserController::class, 'ApproveBulkDevotee'])->middleware(['checkPermission:ApproveBulkDevotee.ApproveBulkDevotee']);
Route::put('/RejectDevotee/{id}', [PostRegistrationUserController::class, 'RejectDevotee'])->middleware(['checkPermission:RejectDevotee.RejectDevotee']);
Route::put('/RejectBulkDevotee/{id}', [PostRegistrationUserController::class, 'RejectBulkDevotee'])->middleware(['checkPermission:RejectBulkDevotee.RejectBulkDevotee']);
Route::delete('/deleteDevotee/{id}', [PostRegistrationUserController::class, 'deleteDevotee'])->middleware(['checkPermission:devoteeList.deleteDevotee']);

Route::get('/partiallydevoteeList', [PostRegistrationUserController::class, 'GetPartiallyDevoteeList'])->middleware(['checkPermission:partiallydevoteeList.GetPartiallyDevoteeList']);
Route::delete('/partiallydevotee/{partiallydevotee}', [PostRegistrationUserController::class, 'DeletePartiallyDevotee'])->name('partiallydevotee.destroy')->middleware(['checkPermission:partiallydevotee.DeletePartiallyDevotee']);
Route::get('/SuperAdminPartiallDevoteeDetails/{id}', [PostRegistrationUserController::class, 'SuperAdminGetPartiallDevoteeDetails'])->middleware(['checkPermission:SuperAdminPartiallDevoteeDetails.SuperAdminGetPartiallDevoteeDetails']);

Route::get('/asheryleader', [AsheryLeaderController::class, 'asheryleader'])->name('Action.asheryleader')->middleware(['checkPermission:asheryleader.asheryleader']);
Route::post('/asheryleader', [AsheryLeaderController::class, 'asheryleaderStore'])->name('Action.AsheryLeaderStore')->middleware(['checkPermission:asheryleader.asheryleaderStore']);
Route::get('/asheryleader/edit/{asheryleader}', [AsheryLeaderController::class, 'edit'])->name('asheryleader.edit')->middleware(['checkPermission:asheryleader.edit']);
Route::put('/asheryleader/{asheryleader}', [AsheryLeaderController::class, 'update'])->name('Action.update')->middleware(['checkPermission:asheryleader.update']);
Route::get('/asheryleader/view/{asheryleader}', [AsheryLeaderController::class, 'view'])->name('asheryleader.view')->middleware(['checkPermission:asheryleader.view']);
Route::delete('/asheryleader/{asheryleader}', [AsheryLeaderController::class, 'destroy'])->name('Action.destroy')->middleware(['checkPermission:asheryleader.destroy']);


Route::middleware(['checkPermission:Devotee.update'])->group(function () {
    Route::get('/SuperAdminDevoteeDetails/{id}', [PostRegistrationUserController::class, 'SuperAdminGetDevoteeDetails']);
    Route::post('/UpdatePersonalInformation', [PostRegistrationUserController::class, 'SuperAdminUpdatePersonalInfo']);
    Route::post('/UpdateSpritualInfoOne', [PostRegistrationUserController::class, 'SuperAdminUpdateSpritualInfoOne']);
    Route::post('/UpdateSpritualInfoTwo', [PostRegistrationUserController::class, 'SuperAdminUpdateSpritualInfoTwo']);
    Route::post('/UpdateSpritualInfoThree', [PostRegistrationUserController::class, 'SuperAdminUpdateSpritualInfoThree']);
    Route::get('/BhaktiBhikshukDevoteeList', [PostRegistrationUserController::class, 'SuperAdminGetBhaktiBhikshukDevoteeList']);
    Route::get('/BhaktiBhikshukDevotee', [PostRegistrationUserController::class, 'AshrayLeaderGetBhaktiBhikshukList']);
});


Route::get('/bhaktibhikshuk', [BhaktiBhikshukController::class, 'bhaktibhikshuk'])->name('Action.bhaktibhikshuk')->middleware(['checkPermission:bhaktibhikshuk.bhaktibhikshuk']);
Route::post('/bhaktibhikshuk', [BhaktiBhikshukController::class, 'bhaktibhikshukStore'])->name('Action.BhaktiBhikshukStore')->middleware(['checkPermission:bhaktibhikshuk.bhaktibhikshukStore']);
Route::get('/bhaktibhikshuk/{bhaktibhikshuk}', [BhaktiBhikshukController::class, 'edit'])->name('asheryleader.edit')->middleware(['checkPermission:bhaktibhikshuk.edit']);
Route::put('/bhaktibhikshuk/{bhaktibhikshuk}', [BhaktiBhikshukController::class, 'update'])->name('Action.update')->middleware(['checkPermission:bhaktibhikshuk.update']);
Route::get('/bhaktibhikshuk/view/{bhaktibhikshuk}', [BhaktiBhikshukController::class, 'view'])->name('asheryleader.view')->middleware(['checkPermission:bhaktibhikshuk.view']);
Route::delete('/bhaktibhikshuk/{id}', [BhaktiBhikshukController::class, 'destroy'])->name('Action.destroy')->middleware(['checkPermission:bhaktibhikshuk.destroy']);

//Route::get('/dashboard', [SuperAdminController::class, 'superadmindashboard'])->name('Action.dashboard');

Route::get('/changepassword', [ChangePasswordController::class, 'showChangePasswordForm'])->name('Action.changepassword')->middleware(['checkPermission:changepassword.showChangePasswordForm']);
Route::post('/changepassword', [ChangePasswordController::class, 'changepassword'])->name('Action.updatePassword')->middleware(['checkPermission:changepassword.changepassword']);
Route::get('/get-login-id/{email}', [ChangePasswordController::class, 'getLoginId'])->name('Action.getLoginId');
Route::get('/userDetailsByEmailID/{email}', [ChangePasswordController::class, 'userDetailsByEmailID'])->name('Action.userDetailsByEmailID');

Route::get('/shikshappuser', [ShikshaAppUserController::class, 'shikshappuser'])->name('Action.shikshappuser')->middleware(['checkPermission:shikshappuser.shikshappuser']);
Route::post('/shikshappuser', [ShikshaAppUserController::class, 'shikshappuserStore'])->name('Action.ShikshAppUserStore')->middleware(['checkPermission:shikshappuser.shikshappuserStore']);
Route::get('/shikshappuser/edit/{shikshappuser}', [ShikshaAppUserController::class, 'edit'])->name('shikshappuser.edit')->middleware(['checkPermission:shikshappuser.edit']);
Route::put('/shikshappuser/{shikshappuser}', [ShikshaAppUserController::class, 'update'])->name('Action.update')->middleware(['checkPermission:shikshappuser.update']);
Route::get('/shikshappuser/view/{shikshappuser}', [ShikshaAppUserController::class, 'view'])->name('shikshappuser.view')->middleware(['checkPermission:shikshappuser.view']);
Route::delete('/shikshappuser/{shikshappuser}', [ShikshaAppUserController::class, 'destroy'])->name('Action.destroy')->middleware(['checkPermission:shikshappuser.destroy']);

Route::get('/subject', [SubjectController::class, 'subject'])->name('Action.subject')->middleware(['checkPermission:subject.subject']);
Route::post('/subject', [SubjectController::class, 'subjectStore'])->name('Action.SubjectStore')->middleware(['checkPermission:subject.subjectStore']);
Route::get('/subject/edit/{subject}', [SubjectController::class, 'edit'])->name('subject.edit')->middleware(['checkPermission:subject.edit']);
Route::put('/subject/{subject}', [SubjectController::class, 'update'])->name('subject.update')->middleware(['checkPermission:subject.update']);
Route::get('/subject/view/{subject}', [SubjectController::class, 'view'])->name('subject.view')->middleware(['checkPermission:subject.view']);
Route::delete('/subject/{subject}', [SubjectController::class, 'destroy'])->name('subject.destroy')->middleware(['checkPermission:subject.destroy']);

Route::get('/shikshalevel', [ShikshaLevelController::class, 'shikshalevel'])->name('Action.shikshalevel')->middleware(['checkPermission:shikshalevel.shikshalevel']);
Route::post('/shikshalevel', [ShikshaLevelController::class, 'shikshalevelStore'])->name('Action.ShikshaLevelStore')->middleware(['checkPermission:shikshalevel.shikshalevelStore']);
Route::get('/shikshalevel/edit/{shikshalevel}', [ShikshaLevelController::class, 'edit'])->name('shikshalevel.edit')->middleware(['checkPermission:shikshalevel.edit']);
Route::put('/shikshalevel/{shikshalevel}', [ShikshaLevelController::class, 'update'])->name('shikshalevel.update')->middleware(['checkPermission:shikshalevel.update']);
Route::get('/shikshalevel/view/{shikshalevel}', [ShikshaLevelController::class, 'view'])->name('shikshalevel.view')->middleware(['checkPermission:shikshalevel.view']);
Route::delete('/shikshalevel/{shikshalevel}', [ShikshaLevelController::class, 'destroy'])->name('shikshalevel.destroy')->middleware(['checkPermission:shikshalevel.destroy']);

Route::get('/devoteeresultlist', [ResultListController::class, 'devoteeresultlist'])->name('Action.devoteeresultlist')->middleware(['checkPermission:Devotee.DevoteeResultList']);
Route::post('/resultAloowPrevent', [ResultListController::class, 'resultAloowPrevent'])->name('Action.resultAloowPrevent')->middleware(['checkPermission:Devotee.UpdateMarks']);

Route::get('/sessionresultlist/{session?}', [SessionResultController::class, 'sessionresultlist'])->name('Action.sessionresultlist')->middleware(['checkPermission:Result.sessionresultlist']);
Route::get('/verifyexam/{encryptedLevel?}/{encryptedSession?}', [ExaminationController::class, 'verifyexam'])->name('Action.verifyexam')->middleware(['checkPermission:Result.verifyexam']);
Route::get('/verifyexamlist/{encryptedLevel?}/{encryptedSession?}', [ExaminationController::class, 'verifyexamlist'])->name('SuperAdmin.verifyexam')->middleware(['checkPermission:Result.verifyexamlist']);
Route::match(['get', 'post'], '/publish-result', [ResultListController::class, 'PublishResult'])->name('Action.publishresult')->middleware(['checkPermission:Result.PublishResult']);
Route::get('/updatemarks/{session?}/{levelName?}/{loginId?}', [ExaminationController::class, 'updatemarks'])->name('Action.updatemarks')->middleware(['checkPermission:Marks.UpdateMarks']);
Route::post('/updatemarks/save', [ExaminationController::class, 'saveUpdatedMarks'])->name('Action.saveUpdatedMarks')->middleware(['checkPermission:Marks.UpdateMarks']);

Route::get('/chapter', [ChapterController::class, 'chapter'])->name('Action.chapter')->middleware(['checkPermission:Chapter.GetChapterList']);
Route::post('/chapter', [ChapterController::class, 'chapterStore'])->name('Action.ChapterStore')->middleware(['checkPermission:Chapter.ChapterStore']);
Route::get('/chapter/edit/{chapter}', [ChapterController::class, 'edit'])->name('chapter.edit')->middleware(['checkPermission:Chapter.Edit']);
Route::put('/chapter/{chapter}', [ChapterController::class, 'update'])->name('chapter.update')->middleware(['checkPermission:Chapter.Update']);
Route::get('/chapter/view/{chapter}', [ChapterController::class, 'view'])->name('chapter.view')->middleware(['checkPermission:Chapter.View']);
Route::delete('/chapter/{chapter}', [ChapterController::class, 'destroy'])->name('chapter.destroy')->middleware(['checkPermission:Chapter.Destroy']);

Route::get('/get-subjects/{levelId}', [QuestionBankController::class, 'getSubjects'])->name('questionbank.getSubjects');

Route::get('/bulkquestionupload', [QuestionBankController::class, 'bulkquestionupload'])->name('Action.bulkquestionupload')->middleware(['checkPermission:Question.BulkQuestionUpload']);
Route::post('/bulkquestionupload', [QuestionBankController::class, 'bulkquestionStore'])->name('Action.bulkquestionStore')->middleware(['checkPermission:Question.BulkQuestionUpload']);

Route::get('/uploadofflinemarks', [ResultListController::class, 'uploadofflinemarks'])->name('Action.uploadofflinemarks')->middleware(['checkPermission:UploadMarks.UploadOfficeMarks']);
Route::post('/uploadofflinemarks', [ResultListController::class, 'uploadofflinemarksStore'])->name('Action.uploadofflinemarksStore')->middleware(['checkPermission:UploadMarks.UploadOfficeMarks']);

Route::get('/AllowExam', [ExaminationController::class, 'AllowDevotteToTakeExam'])->name('AllowExam')->middleware(['checkPermission:AllowExam.AllowToExam']);
Route::post('/AllowExam', [ExaminationController::class, 'SaveAllowExam'])->name('AllowExam')->middleware(['checkPermission:AllowExam.AllowToExam']);

Route::get('/report', [ReportController::class, 'report'])->name('Action.report')->middleware(['checkPermission:Report.report']);
Route::get('/getReport/{type}', [ReportController::class, 'getReport']); //->middleware(['checkPermission:Report.report']);
// Route::get('/message', [SuperAdminController::class, 'message'])->name('Action.message');
// Route::post('/message', [SuperAdminController::class, 'messagestore'])->name('Action.messagestore');

// Start Registration page (render Inertia page)
Route::get('/StartRegistration', function () {
    return Inertia::render('Auth/StartRegistration');
});
// Devotee Registration Status Routes
Route::get('/devotee_registration_status', [DevoteeRegistrationStatusController::class, 'getDevoteeRegistrationStatus'])->name('devotee_registration_status');
Route::post('/start_registration', [DevoteeRegistrationStatusController::class, 'startRegistration'])->name('start_registration')->middleware(['checkPermission:DevoteeRegistrationStatus.Create']);
Route::get('/show_registration_status/{id}', [DevoteeRegistrationStatusController::class, 'ShowRegistrationStatus'])->middleware(['checkPermission:DevoteeRegistrationStatus.Edit']);
Route::post('/update_registration_status/{id}', [DevoteeRegistrationStatusController::class, 'updateRegistrationStatus'])->middleware(['checkPermission:DevoteeRegistrationStatus.Update']);
Route::post('delete_registration_status/{id}', [DevoteeRegistrationStatusController::class, 'deleteRegistrationStatus'])->middleware(['checkPermission:DevoteeRegistrationStatus.Delete']);

// Devotee Module Routes
Route::get('/devotee-module/list', [App\Http\Controllers\DevoteeModuleController::class, 'list'])->name('devotee-module.list')->middleware(['checkPermission:DevoteeShowNextLevel.List']);
Route::get('/devotee-module/details/{id}', [App\Http\Controllers\DevoteeModuleController::class, 'details'])->name('devotee-module.details')->middleware(['checkPermission:DevoteeShowNextLevel.Details']);
Route::get('/devotee-module', [App\Http\Controllers\DevoteeModuleController::class, 'index'])->name('devotee-module.index')->middleware(['checkPermission:DevoteeShowNextLevel.List']);
