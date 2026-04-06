<?php

namespace App\Http\Controllers\Auth\Subject;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject\Subject;
use App\Http\Requests\Subject\SubjectRequest;
use App\Services\AdminCatalogApplicationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function subject()
    {
        $list = $this->adminCatalogApplicationService->listSubjectsWithMasterData();
        //dd($list);
        return Inertia::render('SuperAdmin/subject', $list);
    }


    public function subjectStore(SubjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $subjectinfo = $this->adminCatalogApplicationService->createSubject($request);
        ///dd($subjectinfo);
        return redirect()->route('Action.SubjectStore')
            ->with('success', 'Subject Details Saved Successfully!')
            ->with('savedData', $subjectinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $subjectinfo = $this->adminCatalogApplicationService->deleteSubject($id);
        //return redirect()->back()->with('success', 'Education deleted successfully');
        if ($subjectinfo) {
            return redirect()->back()->with('success', 'Subject deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Subject not found or could not be deleted');
        }
    }

    public function update(SubjectRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $subjectinfo = $this->adminCatalogApplicationService->updateSubject($request);

        return redirect()->route('Action.subject')->with('success', 'Subject updated successfully!');
    }

}
