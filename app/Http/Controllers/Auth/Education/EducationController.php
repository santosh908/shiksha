<?php

namespace App\Http\Controllers\Auth\Education;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Education;
use App\Http\Requests\EducationStore\EducationRequest;
use App\Services\Education\EducationService;
use Illuminate\Http\RedirectResponse;

class EducationController extends Controller
{
    protected $EducationService;

    public function __construct()
    {
        $this->EducationService = new EducationService();
    }

    public function education()
    {
        $list = $this->EducationService->EducationList();
        return Inertia::render('SuperAdmin/education', $list);
    }


    public function educationStore(EducationRequest $request): RedirectResponse
    {
        //dd($request->all());
        $data = $request->validated();
        $educationinfo = $this->EducationService->createEducation($request);
        return redirect()->route('Action.EducationStore')
            ->with('success', 'Education Details Saved Successfully!')
            ->with('savedData', $educationinfo);
    }

    public function destroy($id)
    {
        $educationinfo = $this->EducationService->deleteEducation($id);
        if ($educationinfo) {
            return redirect()->back()->with('success', 'Education deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Education not found or could not be deleted');
        }
    }

    public function update(EducationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $educationinfo = $this->EducationService->updateEducation($request);
        return redirect()->route('Action.education')->with('success', 'Education updated successfully!');
    }
}
