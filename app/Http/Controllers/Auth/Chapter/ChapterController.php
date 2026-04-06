<?php

namespace App\Http\Controllers\Auth\Chapter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AdminCatalogApplicationService;
use App\Http\Requests\Chapter\ChapterRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ChapterController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function chapter()
    {
        $list = $this->adminCatalogApplicationService->listChaptersWithMasterData();
        //dd($list);
        return Inertia::render('SuperAdmin/chapter', $list);
    }


    public function chapterStore(ChapterRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $chapterinfo = $this->adminCatalogApplicationService->createChapter($request);
        //dd($chapterinfo);
        return redirect()->route('Action.ChapterStore')
            ->with('success', 'Chapter Details Saved Successfully!')
            ->with('savedData', $chapterinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $subjectinfo = $this->adminCatalogApplicationService->deleteChapter($id);
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
        $subjectinfo = $this->adminCatalogApplicationService->updateChapter($request);

        return redirect()->route('Action.chapter')->with('success', 'Chapter updated successfully!');
    }
}
