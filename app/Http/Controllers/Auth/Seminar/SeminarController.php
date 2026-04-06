<?php

namespace App\Http\Controllers\Auth\Seminar;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Seminar;
use Illuminate\Http\Request;
use App\Http\Requests\SeminarStore\SeminarStoreRequest;
use App\Services\AdminCatalogApplicationService;
use Illuminate\Http\RedirectResponse;

class SeminarController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }
    
    public function seminar()
    {
        $list = $this->adminCatalogApplicationService->listSeminars();
        return Inertia::render('SuperAdmin/seminar', $list);
    }

    public function seminarStore(SeminarStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        $seminarinfo = $this->adminCatalogApplicationService->createSeminar($request);
        return redirect()->route('Action.SeminarStore')
            ->with('success', 'Seminar Details Saved Successfully!')
            ->with('savedData', $seminarinfo);
    }

    public function destroy($id)
    {
        $seminarinfo = $this->adminCatalogApplicationService->deleteSeminar($id);
        if ($seminarinfo) {
            return redirect()->back()->with('success', 'Seminar deleted successfully');
        }
        return redirect()->back()->with('error', 'Seminar not found or could not be deleted');
    }

    public function update(SeminarStoreRequest $request): RedirectResponse
    {
        //dd($request);
        $data = $request->validated();
        $seminarinfo = $this->adminCatalogApplicationService->updateSeminar($request);
        return redirect()->route('Action.seminar')->with('success', 'Seminar updated successfully!');
    }
}
