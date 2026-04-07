<?php

namespace App\Http\Controllers\Auth\DevoteeResultList;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ResultManagementApplicationService;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ResultListController extends Controller
{
    public function __construct(
        private readonly ResultManagementApplicationService $resultManagementApplicationService
    ) {
    }
    public function devoteeresultlist()
    {
        $list = $this->resultManagementApplicationService->listForSuperAdmin();
        return Inertia::render('SuperAdmin/devoteeresultlist', [
            'devoteeResults' => $list
        ]);
    }

    public function asherydevoteeresultlist()
    {
        $list = $this->resultManagementApplicationService->listForAshrayLeader();
        // dd($list);
        return Inertia::render('AsheryLeader/devoteeresultlist', [
            'devoteeResults' => $list
        ]);
    }

    public function bhaktibhikshukdevoteeresultlist()
    {
        $list = $this->resultManagementApplicationService->listForBhaktiVriksha();
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
        $result = $this->resultManagementApplicationService->allowPrevent($request->toArray());
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
        $publishresultinfo = $this->resultManagementApplicationService->publish($request);
        return redirect()->route('SuperAdmin.verifyexam')->with('success', 'Result Public to Result Section successfully!');

    }

    public function uploadofflinemarks()
    {
        $examList = $this->resultManagementApplicationService->examList();
        $levelList = $this->resultManagementApplicationService->levelList();

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

            $result = $this->resultManagementApplicationService->uploadOffline(
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
