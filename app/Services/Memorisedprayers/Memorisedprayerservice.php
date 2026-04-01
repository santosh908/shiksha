<?php
namespace App\Services\Memorisedprayers;
use App\Models\MemorisedPrayers;

class Memorisedprayerservice
{
  public function createprayers($request)
  {
    return MemorisedPrayers::Create(
      [
        'prayer_name_english' => $request['prayer_name_english'],
        'prayer_name_hindi' => $request['prayer_name_hindi'],
        'is_active' => $request['is_active'],
      ]
    );
  }

  public function PrayerList()
  {
    $PrayerList = [
      'PrayerList' => MemorisedPrayers::all()->toArray(),
    ];

    return $PrayerList;
  }

  public function updatePrayers($request): MemorisedPrayers
  {

    $meritalstatus = MemorisedPrayers::where('id', $request->id)->first();

    $meritalstatus->prayer_name_english = $request['prayer_name_english'];
    $meritalstatus->prayer_name_hindi = $request['prayer_name_hindi'];
    $meritalstatus->is_active = $request['is_active'];
    $meritalstatus->save();

    return $meritalstatus;
  }

  public function deleteMeritalStatus($id)
  {
    $meritalstatus = MemorisedPrayers::find($id);

    return $meritalstatus->delete();
  }
}