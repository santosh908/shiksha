<?php

namespace App\Services\Chapter;
use App\Models\Chapter\chapter;
use App\Models\Subject\Subject;

class ChapterServices
{
    public function createSubject($request)
    {
        return chapter::Create(
            [
                'subject_id' => $request['subject_id'],
                'chapter_name' => $request['chapter_name'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function ChapterList()
    {
        $ChapterList = chapter::select('chapters.id as chapter_code', 'chapters.*', 'subjects.subject_name')
            ->leftJoin('subjects', 'chapters.subject_id', '=', 'subjects.id')
            ->get()
            ->toArray();

        return $ChapterList;
    }

    public function updateChapter($request): chapter
    {
        $chapter = chapter::where('id', $request->id)->first();
        $chapter->subject_id = $request['subject_id'];
        $chapter->chapter_name = $request['chapter_name'];
        $chapter->is_active = $request['is_active'];

        $chapter->save();

        return $chapter;
    }

    public function deleteChapter($id)
    {
        $chapter = chapter::find($id);

        return $chapter->delete();
        //dd($id);
        //return false;
    }

    public function subject()
    {
        return Subject::where('is_active', 'Y')->get()->toArray();
    }
}
