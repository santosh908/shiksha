<?php

namespace App\Http\Controllers\Auth\Chapter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Chapter\ChapterServices;
use App\Http\Requests\Chapter\ChapterRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ChapterController extends Controller
{
    protected $ChapterServices;

    public function __construct()
    {
        $this->ChapterServices = new ChapterServices();
    }

    public function chapter()
    {
        $list = [
            'ChapterList' => $this->ChapterServices->ChapterList(),
            'Subject' => $this->ChapterServices->Subject(),
        ];
        //dd($list);
        return Inertia::render('SuperAdmin/chapter', $list);
    }


    public function chapterStore(ChapterRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $chapterinfo = $this->ChapterServices->createSubject($request);
        //dd($chapterinfo);
        return redirect()->route('Action.ChapterStore')
            ->with('success', 'Chapter Details Saved Successfully!')
            ->with('savedData', $chapterinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $subjectinfo = $this->ChapterServices->deleteChapter($id);
        //return redirect()->back()->with('success', 'Education deleted successfully');
        if ($subjectinfo) {
            return redirect()->back()->with('success', 'Chapter deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Chapter not found or could not be deleted');
        }
    }

    public function update(ChapterRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $subjectinfo = $this->ChapterServices->updateChapter($request);

        return redirect()->route('Action.chapter')->with('success', 'Chapter updated successfully!');
    }
}
