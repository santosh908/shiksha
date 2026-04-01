<?php

namespace App\Http\Controllers\Auth\DevoteeResultList;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DevoteeResultList\DevoteeResultListServices;
use App\Services\Question\QuestionBankService;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ResultListController extends Controller
{
    protected $DevoteeResultListServices;
    protected $QuestionBankService;


    public function __construct()
    {
        $this->DevoteeResultListServices = new DevoteeResultListServices();
        $this->QuestionBankService = new QuestionBankService();
    }
    public function devoteeresultlist()
    {
        $list = $this->DevoteeResultListServices->getDevoteeResultList();
        return Inertia::render('SuperAdmin/devoteeresultlist', [
            'devoteeResults' => $list
        ]);
    }

    public function asherydevoteeresultlist()
    {
        $list = $this->DevoteeResultListServices->getAsheryDevoteeResultList();
        // dd($list);
        return Inertia::render('AsheryLeader/devoteeresultlist', [
            'devoteeResults' => $list
        ]);
    }

    public function bhaktibhikshukdevoteeresultlist()
    {
        $list = $this->DevoteeResultListServices->getBhaktiBhikshukDevoteeResultList();
        // dd($list);
        return Inertia::render('BhaktiBhekshuk/devoteeresultlist', [
            'devoteeResults' => $list
        ]);
    }

    public function resultAloowPrevent(Request $request)
    {
        $validated = $request->validate([
            'login_id' => 'required|exists:users,login_id',
            'exam_id' => 'required',
            'shiksha_level' => 'required',
        ]);
        $result = $this->DevoteeResultListServices->resultAloowPrevent($request->toArray());
        if ($result) {
            return redirect()->back()->with('success', 'Exam updated successfully!');
        }
        return redirect()->back()->with('error', 'Failed to update the exam. Please try again.');
    }

    public function PublishResult(Request $request)
    {
        $validatedData = $request->validate([
            'resultId' => 'required|string',
            'results' => 'required|array|min:1',
            'results.*.login_id' => 'required|string',
            'results.*.exam_id' => 'required|integer',
            'results.*.ashray_leader_code' => 'required|integer',
            'results.*.level' => 'required|string',
            'results.*.allquestion' => 'required|array|min:1',
            'results.*.allquestion.*.question_id' => 'required|integer',
            'results.*.allquestion.*.selected_answer_id' => 'required|string',
        ], [
            'resultId.required' => 'The exam level is required.',
            'resultId.string' => 'The exam level must be a valid string.',
            'results.required' => 'No results were provided for publishing.',
            'results.array' => 'The results must be provided in a valid format.',
            'results.min' => 'At least one result must be selected for publishing.',
            'results.*.login_id.required' => 'Login ID is required for each result.',
            'results.*.login_id.string' => 'Login ID must be a valid string.',
            'results.*.exam_id.required' => 'Exam ID is required for each result.',
            'results.*.exam_id.integer' => 'Exam ID must be a valid integer.',
            'results.*.ashray_leader_code.required' => 'Ashray Leader Code is required for each result.',
            'results.*.ashray_leader_code.integer' => 'Ashray Leader Code must be a valid integer.',
            'results.*.level.required' => 'Level information is required for each result.',
            'results.*.level.string' => 'Level must be a valid string.',
            'results.*.allquestion.required' => 'Questions are required for each result.',
            'results.*.allquestion.array' => 'Questions must be provided in a valid format.',
            'results.*.allquestion.min' => 'At least one question must be provided for each result.',
            'results.*.allquestion.*.question_id.required' => 'Question ID is required for each question.',
            'results.*.allquestion.*.question_id.integer' => 'Question ID must be a valid integer.',
            'results.*.allquestion.*.selected_answer_id.required' => 'Selected answer ID is required for each question.',
            'results.*.allquestion.*.selected_answer_id.string' => 'Selected answer ID must be a valid string.',
        ]);

        //dd($validatedData);
        $publishresultinfo = $this->DevoteeResultListServices->addPublishResult($request);
        return redirect()->route('SuperAdmin.verifyexam')->with('success', 'Result Public to Result Section successfully!');

    }

    public function uploadofflinemarks()
    {
        $examList = $this->DevoteeResultListServices->Examination();
        $levelList = $this->DevoteeResultListServices->ShikshaLevel();

        //dd($examList, $levelList);
        return Inertia::render('SuperAdmin/intractiveexamresult', [
            'examList' => $examList,
            'levelList' => $levelList
        ]);

    }

    public function uploadofflinemarksStore(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:xls,xlsx',
                'examination_id' => 'required|exists:examinations,id',
                'shiksha_level_id' => 'required|exists:shiksha_levels,id'
            ]);

            $file = $request->file('file');
            $selectedExamId = $request->input('examination_id');
            $selectedShikshaLevelId = $request->input('shiksha_level_id');

            $result = $this->DevoteeResultListServices->UploadOfflineMarksExamResult(
                $file,
                $selectedShikshaLevelId,
                $selectedExamId
            );

            return redirect()->route('Action.uploadofflinemarks')
                ->with('success', 'Exam results uploaded successfully! ' . ($result['message'] ?? ''));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => explode("\n", $e->getMessage())]) // Store errors as an array
                ->withInput();
        }
    }

}
