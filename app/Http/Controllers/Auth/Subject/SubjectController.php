<?php

namespace App\Http\Controllers\Auth\Subject;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject\Subject;
use App\Http\Requests\Subject\SubjectRequest;
use App\Services\Subject\SubjectServices;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SubjectController extends Controller
{
    protected $SubjectServices;

    public function __construct()
    {
        $this->SubjectServices = new SubjectServices();
    }

    public function subject()
    {
        $list = [
            'SubjectList' => $this->SubjectServices->SubjectList(),
            'shikshalevel' => $this->SubjectServices->shikshalevel(),
        ];
        //dd($list);
        return Inertia::render('SuperAdmin/subject', $list);
    }


    public function subjectStore(SubjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $subjectinfo = $this->SubjectServices->createSubject($request);
        ///dd($subjectinfo);
        return redirect()->route('Action.SubjectStore')
            ->with('success', 'Subject Details Saved Successfully!')
            ->with('savedData', $subjectinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $subjectinfo = $this->SubjectServices->deleteSubject($id);
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
        $subjectinfo = $this->SubjectServices->updateSubject($request);

        return redirect()->route('Action.subject')->with('success', 'Subject updated successfully!');
    }

}
