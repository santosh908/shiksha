<?php

namespace App\Http\Controllers\Auth\Memorisedprayers;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MemorisedPrayers;
use App\Http\Requests\MemorisedprayersStore\MemorisedprayersStoreRequest;
use Illuminate\Http\RedirectResponse;
use App\Services\Memorisedprayers\Memorisedprayerservice;


class MemorisedprayersController extends Controller
{
    protected $Memorisedprayerservice;

    public function __construct()
    {
        $this->Memorisedprayerservice = new Memorisedprayerservice();
    }

    public function prayers()
    {
        $list = $this->Memorisedprayerservice->PrayerList();
        //dd($list);
        return Inertia::render('SuperAdmin/memorisedprayers', $list);
    }

    public function prayersStore(MemorisedprayersStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $prayerinfo = $this->Memorisedprayerservice->createprayers($request);
        return redirect()->route('Action.PrayersStore')
            ->with('success', 'Prayers Details Saved Successfully!')
            ->with('savedData', $prayerinfo);
    }

    public function destroy($id): RedirectResponse
    {
        $prayersinfo = $this->Memorisedprayerservice->deleteMeritalStatus($id);
        if ($prayersinfo) {
            return redirect()->back()->with('success', 'Prayers deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Prayers not found or could not be deleted');
        }
    }

    public function update(MemorisedprayersStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $prayersinfo = $this->Memorisedprayerservice->updatePrayers($request);
        return redirect()->route('Action.prayers')->with('success', 'Prayers updated successfully!');
    }
}
