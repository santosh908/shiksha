<?php

namespace App\Services\Subject;
use App\Models\Subject\Subject;
use App\Models\ShikshaLevel;
class SubjectServices
{
    public function createSubject($request)
    {
        return Subject::Create(
            [
                'shiksha_level_id' => $request['shiksha_level_id'],
                'subject_name' => $request['subject_name'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function SubjectList()
    {
        $SubjectList = Subject::select('subjects.id as subject_code', 'subjects.*', 'shiksha_levels.exam_level')
            ->leftJoin('shiksha_levels', 'subjects.shiksha_level_id', '=', 'shiksha_levels.id')
            // ->latest() 
            ->get()
            ->toArray();

        return $SubjectList;
    }

    public function updateSubject($request): Subject
    {
        $subject = Subject::where('id', $request->id)->first();
        $subject->shiksha_level_id = $request['shiksha_level_id'];
        $subject->subject_name = $request['subject_name'];
        $subject->is_active = $request['is_active'];

        $subject->save();

        return $subject;
    }

    public function deleteSubject($id)
    {
        $subject = Subject::find($id);

        return $subject->delete();
        //dd($id);
        //return false;
    }

    public function shikshalevel()
    {
        return ShikshaLevel::where('is_active', 'Y')->get()->toArray();
    }
}
