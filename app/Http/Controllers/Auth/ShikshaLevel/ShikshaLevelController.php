<?php

namespace App\Http\Controllers\Auth\ShikshaLevel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ShikshaLevel\ShikshaLevelServices;
use App\Http\Requests\ShikshaLevel\ShikshaLevelRequest;
use App\Models\ShikshaLevel;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ShikshaLevelController extends Controller
{

    protected $ShikshaLevelServices;

    public function __construct()
    {
        $this->ShikshaLevelServices = new ShikshaLevelServices();
    }

    public function shikshalevel()
    {
        $list = $this->ShikshaLevelServices->ShikshaLevelList();
        return Inertia::render('SuperAdmin/shikshalevel', $list);
    }


    public function shikshalevelStore(ShikshaLevelRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $shikshalevelinfo = $this->ShikshaLevelServices->createShikshaLevel($request);
        ///dd($shikshalevelinfo);
        return redirect()->route('Action.ShikshaLevelStore')
            ->with('success', 'Exam Level Details Saved Successfully!')
            ->with('savedData', $shikshalevelinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $shikshalevelinfo = $this->ShikshaLevelServices->deleteShikshaLevel($id);

        if ($shikshalevelinfo) {
            return redirect()->back()->with('success', 'Exam Level deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Exam Level not found or could not be deleted');
        }
    }

    public function update(ShikshaLevelRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $shikshalevelinfo = $this->ShikshaLevelServices->updateShikshaLevel($request);

        return redirect()->route('Action.shikshalevel')->with('success', 'Exam Level updated successfully!');
    }

}
