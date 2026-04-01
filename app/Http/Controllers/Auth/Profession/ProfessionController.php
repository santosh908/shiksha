<?php

namespace App\Http\Controllers\Auth\Profession;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfessionStore\ProfessionStoreRequest;
use App\Services\Profession\ProfessionService;
use App\Models\Profession;
use Illuminate\Http\RedirectResponse;

class ProfessionController extends Controller
{
    protected $ProfessionService;
    
    public function __construct(ProfessionService $ProfessionService)
    {
        $this->ProfessionService = $ProfessionService; // Inject the service via the constructor
    }

    public function profession()
    {   
        $list = $this->ProfessionService->ProfessionList();
        return Inertia::render('SuperAdmin/profession', $list);
    }

    public function professionStore(ProfessionStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $professionInfo = $this->ProfessionService->createProfession($data); // Pass validated data directly
        return redirect()->route('Action.profession') 
                     ->with('success', 'Profession Details Saved Successfully!')
                     ->with('savedData', $professionInfo);
    }

    public function destroy($id): RedirectResponse
    {
        //$profession->delete();
        //return redirect()->back()->with('success', 'Profession deleted successfully');

        $professioninfo = $this->ProfessionService->deleteProfession($id);

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
        $professioninfo = $this->ProfessionService->updateProfession($request);
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