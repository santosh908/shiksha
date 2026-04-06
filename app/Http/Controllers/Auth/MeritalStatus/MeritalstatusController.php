<?php

namespace App\Http\Controllers\Auth\MeritalStatus;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\MeritalStatuStore\MeritalStatusRequest;
use App\Services\AdminCatalogApplicationService;
use Illuminate\Http\RedirectResponse;
use App\Models\MeritalStatus;

class MeritalstatusController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function meritalstatus()
    {   
        $list = $this->adminCatalogApplicationService->listMeritalStatus();
        return Inertia::render('SuperAdmin/meritalstatus', $list);
    }

    public function meritalstatusStore(MeritalStatusRequest $request):RedirectResponse
    {
        $data= $request->validated();
		
        $meritalstatusinfo =  $this->adminCatalogApplicationService->createMeritalStatus($request);
        return redirect()->route('Action.MeritalStatusStore') 
                     ->with('success', 'MeritalStatus Details Saved Successfully!')
                     ->with('savedData', $meritalstatusinfo);
    }

    public function destroy($id): RedirectResponse
    {
        $meritalstatusinfo = $this->adminCatalogApplicationService->deleteMeritalStatus($id);
        if($meritalstatusinfo)
        {
            return redirect()->back()->with('success', 'MeritalStatus deleted successfully');
        }
        else{
            return redirect()->back()->with('error', 'MeritalStatus not found or could not be deleted');
        }
    }

    public function update(MeritalStatusRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $meritalstatusinfo = $this->adminCatalogApplicationService->updateMeritalStatus($request);
        return redirect()->route('Action.meritalstatus')->with('success', 'MeritalStatus updated successfully!');
    }
}
