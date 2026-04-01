<?php

namespace App\Http\Controllers\Auth\QuestionBank;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionBankStore\QuestionBankRequest;
use App\Services\Question\QuestionBankService;
use App\Services\Examination\ExaminationService;
use Illuminate\Http\Request;
use App\Models\QuestionBank\QuestionBank;
use App\Models\Subject\Subject;
use App\Models\ShikshaLevel;
use App\Models\QuestionBank\ExamQuestionMoel;
use Illuminate\Http\RedirectResponse;


class QuestionBankController extends Controller
{
    protected $QuestionBankService;
    protected $examServices;

    public function __construct()
    {
        $this->QuestionBankService = new QuestionBankService();
        $this->examServices = new ExaminationService();
    }

    public function questionbank()
    {
        $list = $this->QuestionBankService->QuestionBankList();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        $subjectList = $this->QuestionBankService->SubjectList();
        $chapterList = $this->QuestionBankService->ChapterList();
        //dd($shikshalevel, $subjectList, $list);
        return Inertia::render('SuperAdmin/questionbank', [
            'QuestionBank' => ['QuestionBankList' => $list],
            'subjectList' => $subjectList,
            'shikshalevel' => $shikshalevel,
            'chapterList' => $chapterList,
        ]);
    }

    public function addQuestion()
    {
        $subjectList = Subject::all()->toArray();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        return Inertia::render(
            'SuperAdmin/addquestion',
            [
                'QuestionBankList' => [],
                'subjectList' => $subjectList,
                'shikshalevel' => $shikshalevel,
                'examList' => $this->examServices->getExamSessionWithExamName(),
            ]
        );
    }

    public function filterQuestions(Request $request)
    {
        $filteredQuestions = $this->QuestionBankService->filterQuestions($request);
        $subjectList = $this->QuestionBankService->SubjectList();
        $chapterList = $this->QuestionBankService->ChapterList();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        return Inertia::render(
            'SuperAdmin/addquestion',
            [
                'QuestionBankList' => $filteredQuestions,
                'subjectList' => $subjectList,
                'shikshalevel' => $shikshalevel,
                'chapterList' => $chapterList,
                'examList' => $this->examServices->getExamSessionWithExamNameByFilter($request),
            ]
        );
    }

    public function addQuestionsToExams(Request $request)
    {
        //dd($request);
        $validatedData = $request->validate([
            'questionIds' => 'required|array|min:1',
            'examId' => 'required',
        ], [
            'questionIds.required' => 'The question IDs are required.',
            'questionIds.array' => 'The question IDs must be an array.',
            'questionIds.min' => 'At least one question ID is required.',
            'examId.required' => 'The exam ID is required.',
        ]);

        $questionbankinfo = $this->QuestionBankService->addQuestionsToExams($request);
        return redirect()->route('Action.addquestion')->with('success', 'Question added to exam successfully!');
    }

    public function removeQuestion(Request $request)
    {
        $questionId = $request->query('question_id');
        $examId = $request->query('exam_id');
        $question = $this->QuestionBankService->removeQuestion($request);
        if ($question) {
            return redirect()->back()->with('success', 'Question removed successfully');
        } else {
            return redirect()->back()->with('error', 'Question not found or could not be remove');
        }
    }

    public function questionbankStore(QuestionBankRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $questionbankinfo = $this->QuestionBankService->createQuestionBank($request);
        return redirect()->route('Action.QuestionStore')
            ->with('success', 'Question Details Saved Successfully!')
            ->with('savedData', $questionbankinfo);
    }

    public function update(QuestionBankRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $questionbankinfo = $this->QuestionBankService->updateQuestionBank($request);
        return redirect()->route('Action.questionbank')->with('success', 'Question updated successfully!');
    }

    public function bulkquestionupload()
    {
        $list = $this->QuestionBankService->QuestionBankList();
        return Inertia::render('SuperAdmin/uploadbulkquestion', [
            'QuestionBank' => ['QuestionBankList' => $list],
        ]);
    }

    public function bulkquestionStore(Request $request): RedirectResponse
    {
        // dd($request->toArray());
        try {
            $request->validate([
                'file' => 'required|file|mimes:xls,xlsx'
            ]);

            $file = $request->file('file');
            $result = $this->QuestionBankService->createBulkQuestionBank($file);

            return redirect()->route('Action.questionbank')
                ->with('success', 'Questions uploaded successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error uploading questions: ' . $e->getMessage());
        }
    }
}
