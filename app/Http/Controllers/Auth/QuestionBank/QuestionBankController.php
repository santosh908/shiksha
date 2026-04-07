<?php

namespace App\Http\Controllers\Auth\QuestionBank;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionBankStore\QuestionBankRequest;
use App\Services\QuestionBankApplicationService;
use Illuminate\Http\Request;
use App\Models\QuestionBank\QuestionBank;
use App\Models\Subject\Subject;
use App\Models\ShikshaLevel;
use App\Models\QuestionBank\ExamQuestionMoel;
use Illuminate\Http\RedirectResponse;


class QuestionBankController extends Controller
{
    public function __construct(
        private readonly QuestionBankApplicationService $questionBankApplicationService
    ) {
    }

    public function questionbank()
    {
        $list = $this->questionBankApplicationService->list();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        $subjectList = $this->questionBankApplicationService->subjects();
        $chapterList = $this->questionBankApplicationService->chapters();
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
                'examList' => $this->questionBankApplicationService->examSessionsWithNames(),
            ]
        );
    }

    public function filterQuestions(Request $request)
    {
        $filteredQuestions = $this->questionBankApplicationService->filterQuestions($request);
        $subjectList = $this->questionBankApplicationService->subjects();
        $chapterList = $this->questionBankApplicationService->chapters();
        $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
        return Inertia::render(
            'SuperAdmin/addquestion',
            [
                'QuestionBankList' => $filteredQuestions,
                'subjectList' => $subjectList,
                'shikshalevel' => $shikshalevel,
                'chapterList' => $chapterList,
                'examList' => $this->questionBankApplicationService->examSessionsWithNamesByFilter($request),
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

        $questionbankinfo = $this->questionBankApplicationService->addQuestionsToExams($request);
        return redirect()->route('Action.addquestion')->with('success', 'Question added to exam successfully!');
    }

    public function removeQuestion(Request $request)
    {
        $questionId = $request->query('question_id');
        $examId = $request->query('exam_id');
        $question = $this->questionBankApplicationService->removeQuestion($request);
        if ($question) {
            return redirect()->back()->with('success', 'Question removed successfully');
        } else {
            return redirect()->back()->with('error', 'Question not found or could not be remove');
        }
    }

    public function questionbankStore(QuestionBankRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $questionbankinfo = $this->questionBankApplicationService->create($request);
        return redirect()->route('Action.QuestionStore')
            ->with('success', 'Question Details Saved Successfully!')
            ->with('savedData', $questionbankinfo);
    }

    public function update(QuestionBankRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $questionbankinfo = $this->questionBankApplicationService->update($request);
        return redirect()->route('Action.questionbank')->with('success', 'Question updated successfully!');
    }

    public function edit(QuestionBank $questionbank)
    {
        return response()->json($questionbank);
    }

    public function view(QuestionBank $questionbank)
    {
        return response()->json($questionbank);
    }

    public function destroy(QuestionBank $questionbank): RedirectResponse
    {
        $deleted = $questionbank->delete();
        if ($deleted) {
            return redirect()->back()->with('success', 'Question deleted successfully');
        }

        return redirect()->back()->with('error', 'Question not found or could not be deleted');
    }

    public function getSubjects($levelId)
    {
        $subjects = Subject::where('is_active', 'Y')
            ->orderBy('subject_name', 'asc')
            ->get();

        return response()->json($subjects);
    }

    public function bulkquestionupload()
    {
        $list = $this->questionBankApplicationService->list();
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
            $result = $this->questionBankApplicationService->bulkUpload($file);

            return redirect()->route('Action.questionbank')
                ->with('success', 'Questions uploaded successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error uploading questions: ' . $e->getMessage());
        }
    }
}
