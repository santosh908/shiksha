<?php

namespace App\Http\Controllers\Auth\Profession;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfessionStore\ProfessionStoreRequest;
use App\Services\AdminCatalogApplicationService;
use App\Models\Profession;
use Illuminate\Http\RedirectResponse;

class ProfessionController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function profession()
    {   
        $list = $this->adminCatalogApplicationService->listProfessions();
        return Inertia::render('SuperAdmin/profession', $list);
    }

    public function professionStore(ProfessionStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $professionInfo = $this->adminCatalogApplicationService->createProfession($data);
        return redirect()->route('Action.profession') 
                     ->with('success', 'Profession Details Saved Successfully!')
                     ->with('savedData', $professionInfo);
    }

    public function destroy($id): RedirectResponse
    {
        //$profession->delete();
        //return redirect()->back()->with('success', 'Profession deleted successfully');

        $professioninfo = $this->adminCatalogApplicationService->deleteProfession($id);

        if($professioninfo)
        {
            return redirect()->back()->with('success', 'Profession deleted successfully');
        }
        else{
            return redirect()->back()->with('error', 'Profession not found or could not be deleted');
        }
    }

    public function update(ProfessionStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $professioninfo = $this->adminCatalogApplicationService->updateProfession($request);
        return redirect()->route('Action.profession')->with('success', 'Profession updated successfully!');
    }


//     public function edit(Profession $profession)
//     {
//         return Inertia::render('SuperAdmin/EditProfession', [
//             'profession' => $profession
//         ]);
//     }

//     public function view(Profession $profession)
//     {
//         return Inertia::render('SuperAdmin/ViewProfession', [
//             'profession' => $profession
//         ]);
//     }
}