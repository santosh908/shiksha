<?php

namespace App\Http\Controllers\Auth\Education;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Education;
use App\Http\Requests\EducationStore\EducationRequest;
use App\Services\AdminCatalogApplicationService;
use Illuminate\Http\RedirectResponse;

class EducationController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function education()
    {
        $list = $this->adminCatalogApplicationService->listEducation();
        return Inertia::render('SuperAdmin/education', $list);
    }


    public function educationStore(EducationRequest $request): RedirectResponse
    {
        //dd($request->all());
        $data = $request->validated();
        $educationinfo = $this->adminCatalogApplicationService->createEducation($request);
        return redirect()->route('Action.EducationStore')
            ->with('success', 'Education Details Saved Successfully!')
            ->with('savedData', $educationinfo);
    }

    public function destroy($id)
    {
        $educationinfo = $this->adminCatalogApplicationService->deleteEducation($id);
        if ($educationinfo) {
            return redirect()->back()->with('success', 'Education deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Education not found or could not be deleted');
        }
    }

    public function update(EducationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $educationinfo = $this->adminCatalogApplicationService->updateEducation($request);
        return redirect()->route('Action.education')->with('success', 'Education updated successfully!');
    }
}
