<?php

namespace App\Services\ShikshaLevel;
use App\Models\ShikshaLevel;

class ShikshaLevelServices
{
    public function createShikshaLevel($request)
    {
        return ShikshaLevel::Create(
            [
                'exam_level' => $request['exam_level'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function ShikshaLevelList()
    {
        $ShikshaLevelList = [
            'SubjectList' => ShikshaLevel::all()
                ->map(function ($level) {
                    $data = $level->toArray();
                    $data['shikshalevel_code'] = $level->id;
                    return $data;
                })
                ->toArray(),
        ];

        return $ShikshaLevelList;
    }

    public function ShikshaLevelListForDevotee()
    {
        return ShikshaLevel::whereNotIn('shiksha_levels.id', [1, 6, 8,9])->get()->toArray();
    }

    public function updateShikshaLevel($request): ShikshaLevel
    {
        $shikshalevel = ShikshaLevel::where('id', $request->id)->first();

        $shikshalevel->exam_level = $request['exam_level'];
        $shikshalevel->is_active = $request['is_active'];

        $shikshalevel->save();

        return $shikshalevel;
    }

    public function deleteShikshaLevel($id)
    {
        $shikshalevel = ShikshaLevel::find($id);

        return $shikshalevel->delete();
        //dd($id);
        //return false;
    }
}
