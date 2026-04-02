<?php

namespace App\Http\Controllers\Auth\Examination;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Examination\Examination;
use App\Models\QuestionBank\QuestionBank;
use App\Http\Requests\ExaminationStore\ExaminationRequest;
use App\Http\Requests\ExaminationStore\ExamSessionRequest;
use App\Http\Requests\ExaminationStore\SubmitQuestionRequest;
use App\Application\DevoteeExam\DTOs\SaveExamAnswerData;
use App\Models\Examination\ExamSessionModel;
use App\Services\DevoteeExamApplicationService;
use App\Services\ExamAdminApplicationService;
use App\Services\Examination\ExaminationService;
use App\Services\Question\QuestionBankService;
use App\Models\ShikshaLevel;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use App\Services\EncryptionService\EncryptionServices;

class ExaminationController extends Controller
{
    public function __construct(
        protected ExaminationService $examinationService,
        protected DevoteeExamApplicationService $devoteeExamApplicationService,
        protected ExamAdminApplicationService $examAdminApplicationService,
        protected QuestionBankService $questionBankService,
    ) {
    }

    public function exam_session()
    {
        $list = $this->examAdminApplicationService->listExamSessions();

        return Inertia::render('ExamSession/exam_session', [
            'ExamSessionList' => $list
        ]);
    }

    public function exam_session_store(ExamSessionRequest $request)
    {
        $payload = $this->examSessionPayloadFromRequest($request);
        $examSession = $this->examAdminApplicationService->createExamSession($payload);

        return redirect()->route('Action.exam_session_store')
            ->with('success', 'Exam Session Details Saved Successfully!')
            ->with('savedData', $examSession);
    }

    public function session_edit(ExamSessionRequest $request, $ExamSession)
    {
        $payload = array_merge(
            $this->examSessionPayloadFromRequest($request),
            ['id' => $ExamSession]
        );
        $this->examAdminApplicationService->updateExamSession($payload);

        return redirect()->route('Action.ExamSession')->with('success', 'Exam session updated successfully!');
    }

    public function deleteExamSession($id)
    {
        $this->examAdminApplicationService->deleteExamSession($id);

        return redirect()->route('Action.ExamSession')->with('success', 'Exam session seleted successfully!');
    }

    public function examination()
    {
        $list = $this->examAdminApplicationService->listExaminations();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get();

        return Inertia::render('SuperAdmin/examination', [
            'Examination' => $list,
            'shikshalevel' => $shikshalevel,
            'ExamSession' => $this->examAdminApplicationService->listExamSessions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function examinationStore(ExaminationRequest $request): RedirectResponse
    {
        $examinationinfo = $this->examAdminApplicationService->createExamination(
            $this->examinationPayloadFromRequest($request)
        );

        return redirect()->route('Action.ExaminationStore')
            ->with('success', 'Examination Details Saved Successfully!')
            ->with('savedData', $examinationinfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExaminationRequest $request, Examination $examination): RedirectResponse
    {
        $payload = array_merge(
            $this->examinationPayloadFromRequest($request),
            ['id' => $examination->id]
        );
        $this->examAdminApplicationService->updateExamination($payload);

        return redirect()->route('Action.examination')->with('success', 'Examination updated successfully!');
    }

    /**
     * @return array<string, mixed>
     */
    private function examSessionPayloadFromRequest(ExamSessionRequest $request): array
    {
        $payload = $request->validated();
        if ($request->has('session_start_date')) {
            $payload['session_start_date'] = $request->input('session_start_date');
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    private function examinationPayloadFromRequest(ExaminationRequest $request): array
    {
        $payload = $request->validated();
        if ($request->has('remarks')) {
            $payload['remarks'] = $request->input('remarks');
        }

        return $payload;
    }

    /**
     * Display the specified resource.
     */
    public function view(Examination $examination)
    {
        return Inertia::render('SuperAdmin/ViewExamination', [
            'examination' => $examination
        ]);
    }

    public function getFilterQuestionList(Request $request)
    {
        $exam_name = $request->input('exam_name');
        $subject_level = $request->input('subject_level');
        $difficulty_level = $request->input('difficulty_level');
        // Query the database based on the provided filters
        $filteredQuestions = QuestionBank::where('exam_name', $exam_name)
            ->where('subject_level', $subject_level)
            ->where('difficulty_level', $difficulty_level)
            ->get();

        return response()->json($filteredQuestions);
    }


    public function TakeExam($examID)
    {
        $decodedId = (int) base64_decode($examID);
        $examDetails = $this->devoteeExamApplicationService->getExamIntroDetails($decodedId);

        return Inertia::render('Devotee/TakeExam', [
            'examDetails' => $examDetails
        ]);
    }

    public function StartExam($examID)
    {
        session(['current_exam_id' => $examID]);
        $decodedId = (int) base64_decode($examID);
        $exam = $this->devoteeExamApplicationService->getDevoteeExamSessionState($decodedId);
        if ($exam[0]['is_submitted'] == 1) {
            return redirect()->route('PromotedLavel');
        }

        return Inertia::render('Devotee/StartExam', [
            'QuestionList' => $this->questionBankService->QuestionByExamId($decodedId),
            'ExamDetails' => $exam
        ]);
    }

    public function SaveFinalizeExam(Request $request)
    {
        if ($request->examId == null) {
            return redirect()->route('Devotee.AfterExamSubmission')->with('success', 'Final submission could not saved, please contact to Admin!');
        }
        $examId = (int) $request->examId;
        $exam = $this->devoteeExamApplicationService->getDevoteeExamSessionState($examId);
        if ($exam[0]['is_submitted'] == 1) {
            return redirect()->route('PromotedLavel');
        }
        $this->devoteeExamApplicationService->finalizeExam($examId);

        return redirect()->route('Devotee.AfterExamSubmission')->with('success', 'You have submited your successfully!');
    }

    public function SubmitQuestion(SubmitQuestionRequest $request)
    {
        $exam = $this->devoteeExamApplicationService->getDevoteeExamSessionState($request->examId);
        if ($exam[0]['is_submitted'] == 1) {
            return redirect()->route('PromotedLavel');
        }
        $this->devoteeExamApplicationService->saveAnswer(SaveExamAnswerData::fromValidated($request->validated()));

        return Inertia::render('Devotee/StartExam', [
            'QuestionList' => $this->questionBankService->QuestionByExamId($request->examId),
            'ExamDetails' => $this->devoteeExamApplicationService->getExamIntroDetails($request->examId)
        ]);
    }

    public function AllowDevotteToTakeExam()
    {
        $shikshalevel = $this->examinationService->getExamListToAllowDevotee();
        //dd($shikshalevel);
        $loginid = User::where('devotee_type', 'AD')->get();
        return Inertia::render('SuperAdmin/allowExam', [
                'ExamList' => $shikshalevel,
                'UserList' => $loginid
            ]);
    }

    public function SaveAllowExam(Request $request)
    {
       // dd($request);
        $validated = $request->validate([
            'exam_id' => 'required',
            'user_id' => 'required',
        ]);
        $success = $this->examinationService->allowUserToRetakeExam($request);
    
        if ($success) {
            return back()->with('success', 'User allowed to retake the exam.');
        }
        return back()->with('error', 'Selected user did not attened the Exam');
    }

    public function AfterExamSubmission()
    {
        return Inertia::render('Devotee/AfterExamSubmission');
    }

    public function verifyexam()
    {
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        $examSession = ExamSessionModel::All()->toArray();
        return Inertia::render('SuperAdmin/verifyexamlist', [
            'shikshalevel' => $shikshalevel,
            'examSession' => $examSession
        ]);
    }

    public function verifyexamlist($encryptedLevel = null, $encryptedSession = null)
    {
        $level = explode('_', EncryptionServices::decrypt($encryptedLevel))[0];
        $session = explode('_', EncryptionServices::decrypt($encryptedSession))[0];
        $shikshalevel = $this->examinationService->getShikshaLevelList();
        $examinationsessionlist = $this->examinationService->getExaminationSessionList();
        $list = ($level && $session) ? $this->examinationService->getVerifyExamList($level, $session) : [];
        return Inertia::render('SuperAdmin/verifyexamlist', [
            'submittedexam' => $list,
            'shikshalevel' => $shikshalevel,
            'examSession' => $examinationsessionlist,
        ]);
    }

    public function updatemarks($sessionID = null, $levelID = null, $loginId = null)
    {
        $shikshalevel = $this->examinationService->getShikshaLevelList();
        $loginid = $this->examinationService->getLoginIdList();
        $sessionList= $this->examinationService->getExaminationSessionList();
        $list = ($sessionID && $levelID && $loginId) ? $this->examinationService->getSessionResultList($sessionID, $levelID, $loginId) : [];
        return Inertia::render('SuperAdmin/updatemarks', [
            'devoteeResults' => $list,
            'shikshalevel' => $shikshalevel,
            'loginid' => $loginid,
            'sessionList' => $sessionList,
        ]);
    }
    // Controller
    public function saveUpdatedMarks(Request $request)
    {
        $validated = $request->validate([
            'login_id' => 'required|string',
            'exam_id' => 'required|numeric',
            'exam_level' => 'required',
            'total_obtain' => 'required|numeric',
        ]);

        $updatemarks = $this->examinationService->updateMarks(
            $validated['exam_id'],
            $validated['exam_level'],
            $validated['login_id'],
            $validated['total_obtain']
        );
        if (!is_array($updatemarks) || empty($updatemarks['success'])) {
            $errorMsg = is_array($updatemarks) && !empty($updatemarks['message'])
                ? $updatemarks['message']
                : 'Marks could not be updated, please check qualifying marks or total marks!';
            return redirect()->route('Action.updatemarks')
                ->with('error', $errorMsg);
        }
        return redirect()->route('Action.updatemarks')
            ->with('success', 'Marks updated successfully!');
    }

}
