<?php

namespace App\Http\Controllers\Auth\Seminar;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Seminar;
use Illuminate\Http\Request;
use App\Http\Requests\SeminarStore\SeminarStoreRequest;
use App\Services\Seminar\SeminarService;
use Illuminate\Http\RedirectResponse;

class SeminarController extends Controller
{
    protected $SeminarService;

    public function __construct()
    {
        $this->SeminarService = new SeminarService();
    }
    
    public function seminar()
    {
        $list = $this->SeminarService->SeminarList();
        return Inertia::render('SuperAdmin/seminar', $list);
    }

    public function seminarStore(SeminarStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        $seminarinfo = $this->SeminarService->createSeminar($request);
        return redirect()->route('Action.SeminarStore')
            ->with('success', 'Seminar Details Saved Successfully!')
            ->with('savedData', $seminarinfo);
    }

    public function destroy($id)
    {
        //$seminar->delete();
    }

    public function update(SeminarStoreRequest $request): RedirectResponse
    {
        //dd($request);
        $data = $request->validated();
        $seminarinfo = $this->SeminarService->updateSeminar($request);
        return redirect()->route('Action.seminar')->with('success', 'Seminar updated successfully!');
    }
}
