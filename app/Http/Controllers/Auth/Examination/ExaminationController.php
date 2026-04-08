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
use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use App\Application\ExamOps\DTOs\UpdateMarksData;
use App\Application\ExamOps\DTOs\VerifyExamListFilterData;
use App\Application\DevoteeExam\DTOs\SaveExamAnswerData;
use App\Services\DevoteeExamApplicationService;
use App\Services\ExamAdminApplicationService;
use App\Services\ExamOpsApplicationService;
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
        protected ExamOpsApplicationService $examOpsApplicationService,
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
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->orderBy('id', 'desc')->get();

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

        return redirect()->route('Action.examination')
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

    public function edit(Examination $examination)
    {
        return response()->json($examination);
    }

    public function destroy(Examination $examination): RedirectResponse
    {
        $deleted = $examination->delete();
        if ($deleted) {
            return redirect()->back()->with('success', 'Examination deleted successfully');
        }

        return redirect()->back()->with('error', 'Examination not found or could not be deleted');
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
        $shikshalevel = $this->examOpsApplicationService->allowExamList();
        //dd($shikshalevel);
        $loginid = User::where('devotee_type', 'AD')->get();
        return Inertia::render('SuperAdmin/allowExam', [
                'ExamList' => $shikshalevel,
                'UserList' => $loginid
            ]);
    }

    public function SaveAllowExam(Request $request)
    {
        $dto = AllowExamRetakeData::fromArray($request->all());
        $success = $this->examOpsApplicationService->allowRetake($dto);
    
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
        $shikshalevel = $this->examOpsApplicationService->shikshaLevels();
        $examSession = $this->examOpsApplicationService->examSessions();
        return Inertia::render('SuperAdmin/verifyexamlist', [
            'shikshalevel' => $shikshalevel,
            'examSession' => $examSession
        ]);
    }

    public function verifyexamlist($encryptedLevel = null, $encryptedSession = null)
    {
        $level = explode('_', EncryptionServices::decrypt($encryptedLevel))[0];
        $session = explode('_', EncryptionServices::decrypt($encryptedSession))[0];
        $shikshalevel = $this->examOpsApplicationService->shikshaLevels();
        $examinationsessionlist = $this->examOpsApplicationService->examSessions();
        $list = [];
        if ($level && $session) {
            $list = $this->examOpsApplicationService->verifyExamList(
                VerifyExamListFilterData::fromArray([
                    'level' => (int) $level,
                    'session' => (int) $session,
                ])
            );
        }
        return Inertia::render('SuperAdmin/verifyexamlist', [
            'submittedexam' => $list,
            'shikshalevel' => $shikshalevel,
            'examSession' => $examinationsessionlist,
        ]);
    }

    public function updatemarks($sessionID = null, $levelID = null, $loginId = null)
    {
        $shikshalevel = $this->examOpsApplicationService->shikshaLevels();
        $loginid = $this->examOpsApplicationService->loginIds();
        $sessionList= $this->examOpsApplicationService->examSessions();
        $list = ($sessionID && $levelID && $loginId)
            ? $this->examOpsApplicationService->sessionResultList($sessionID, $levelID, $loginId)
            : [];
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
        $dto = UpdateMarksData::fromArray($request->all());
        $updatemarks = $this->examOpsApplicationService->updateMarks($dto);
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
