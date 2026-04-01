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
use App\Http\Requests\ExaminationStore\SubmitExamRequest;
use App\Services\Examination\ExaminationService;
use App\Services\Question\QuestionBankService;
use App\Models\ShikshaLevel;
use App\Models\User;
use App\Models\Examination\ExamSessionModel;
use Illuminate\Http\RedirectResponse;
use App\Services\EncryptionService\EncryptionServices;

class ExaminationController extends Controller
{
    protected $ExaminationService;
    protected $QuestionBankService;

    public function __construct()
    {
        $this->ExaminationService = new ExaminationService();
        $this->QuestionBankService = new QuestionBankService();
    }

    public function exam_session()
    {
        $list = $this->ExaminationService->getExamSessionList();
        return Inertia::render('ExamSession/exam_session', [
            'ExamSessionList' => $list
        ]);
    }

    public function exam_session_store(ExamSessionRequest $request)
    {
        $data = $request->validated();
        $examSession = $this->ExaminationService->createExamSession($request);
        return redirect()->route('Action.exam_session_store')
            ->with('success', 'Exam Session Details Saved Successfully!')
            ->with('savedData', $examSession);
    }

    public function session_edit(ExamSessionRequest $request)
    {
        $data = $request->validated();
        $examSession = $this->ExaminationService->updateExamSession($request);
        return redirect()->route('Action.ExamSession')->with('success', 'Exam session updated successfully!');
    }

    public function deleteExamSession($id)
    {
        $examSession = $this->ExaminationService->deleteExamSession($id);
        return redirect()->route('Action.ExamSession')->with('success', 'Exam session seleted successfully!');
    }

    public function examination()
    {
        $list = $this->ExaminationService->ExaminationList();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get();
        return Inertia::render('SuperAdmin/examination', [
            'Examination' => $list,
            'shikshalevel' => $shikshalevel,
            'ExamSession' => ExamSessionModel::All()->toArray()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function examinationStore(ExaminationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $examinationinfo = $this->ExaminationService->createExamination($request);
        return redirect()->route('Action.ExaminationStore')
            ->with('success', 'Examination Details Saved Successfully!')
            ->with('savedData', $examinationinfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExaminationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $examinationinfo = $this->ExaminationService->updateExamination($request);
        return redirect()->route('Action.examination')->with('success', 'Examination updated successfully!');
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
        $decodedId = base64_decode($examID);
        $examDetails = $this->ExaminationService->ExamDetailsById($decodedId);
        //dd($examDetails);
        return Inertia::render('Devotee/TakeExam', [
            'examDetails' => $examDetails
        ]);
    }

    public function StartExam($examID)
    {
        session(['current_exam_id' => $examID]);
        $decodedId = base64_decode($examID);
        $exam=$this->ExaminationService->DevoteeExamDetailsById($decodedId);
        //dd($exam);
        if($exam[0]['is_submitted']==1)
        {
            return redirect()->route('PromotedLavel');
        }
        else{
            return Inertia::render('Devotee/StartExam', [
                'QuestionList' => $this->QuestionBankService->QuestionByExamId($decodedId),
                'ExamDetails' =>$exam
            ]);
        }
    }
 
    public function SaveFinalizeExam(Request $request)
    {
        $exam=$this->ExaminationService->DevoteeExamDetailsById($request->examId);
        if($exam[0]['is_submitted']==1)
        {
            return redirect()->route('PromotedLavel');
        }
        else if($request->examId==null)
        {
            return redirect()->route('Devotee.AfterExamSubmission')->with('success', 'Final submission could not saved, please contact to Admin!');
        }
        else{
            $examinationinfo = $this->ExaminationService->SubmitExam($request);
            return redirect()->route('Devotee.AfterExamSubmission')->with('success', 'You have submited your successfully!');
        }
    }

    public function SubmitQuestion(SubmitQuestionRequest $request)
    {
        $exam=$this->ExaminationService->DevoteeExamDetailsById($request->examId);
        if($exam[0]['is_submitted']==1)
        {
            return redirect()->route('PromotedLavel');
        }
        $validatedData = $request->validated();
        $examinationinfo = $this->ExaminationService->SaveSingleQuestion($request);
        return Inertia::render('Devotee/StartExam', [
            'QuestionList' => $this->QuestionBankService->QuestionByExamId($request->examId),
            'ExamDetails' => $this->ExaminationService->ExamDetailsById($request->examId)
        ]);
    }

    public function AllowDevotteToTakeExam()
    {
        $shikshalevel = $this->ExaminationService->getExamListToAllowDevotee();
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
        $success = $this->ExaminationService->allowUserToRetakeExam($request);
    
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
        $shikshalevel = $this->ExaminationService->getShikshaLevelList();
        $examinationsessionlist = $this->ExaminationService->getExaminationSessionList();
        $list = ($level && $session) ? $this->ExaminationService->getVerifyExamList($level, $session) : [];
        return Inertia::render('SuperAdmin/verifyexamlist', [
            'submittedexam' => $list,
            'shikshalevel' => $shikshalevel,
            'examSession' => $examinationsessionlist,
        ]);
    }

    public function updatemarks($sessionID = null, $levelID = null, $loginId = null)
    {
        $shikshalevel = $this->ExaminationService->getShikshaLevelList();
        $loginid = $this->ExaminationService->getLoginIdList();
        $sessionList= $this->ExaminationService->getExaminationSessionList();
        $list = ($sessionID && $levelID && $loginId) ? $this->ExaminationService->getSessionResultList($sessionID, $levelID, $loginId) : [];
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

        $updatemarks = $this->ExaminationService->updateMarks(
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
