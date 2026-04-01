<?php

namespace App\Http\Controllers\Auth\Announcement;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementStore\AnnouncementRequest;
use App\Services\Announcement\AnnouncementService;
use Illuminate\Http\Request;
use App\Models\Announcements; 
use Illuminate\Http\RedirectResponse;
use CryptoJS;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class AnnouncementController extends Controller
{
    protected $AnnouncementService;

    public function __construct()
    {
        $this->AnnouncementService = new AnnouncementService();
    }
 
    public function announcement()
    {
        $list = $this->AnnouncementService->AnnouncementList();
        return Inertia::render('SuperAdmin/announcement', $list);
    }

    public function announcementStore(AnnouncementRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $announcementinfo = $this->AnnouncementService->createAnnouncement($request);

        return redirect()->route('Action.announcement')
            ->with('success', 'Announcement Details Saved Successfully!')
            ->with('savedData', $announcementinfo);
    }

    public function destroy($id)
    {
        $announcementinfo = $this->AnnouncementService->deleteAnnouncement($id);
        if($announcementinfo)
        {
            return redirect()->back()->with('success', 'Announcement deleted successfully');
        }
        else{
            return redirect()->back()->with('error', 'Announcement not found or could not be deleted');
        }
    }

    public function update(AnnouncementRequest $request): RedirectResponse
    {
        //dd($request);
        $data = $request->validated();

        $announcementinfo = $this->AnnouncementService->updateAnnouncement($request);
        return redirect()->route('Action.announcement')->with('success', 'Announcement updated successfully!');
    }

    public function getAnnouncementsDescription($id)
    { 
        try {
            
            // Base64 decode the ID 
            $decodedId = base64_decode($id);
            $announcementinfo = $this->AnnouncementService->AnnouncementsDescription( $decodedId);
            return Inertia::render('PublicPage/AnnnouncementDescription', [
                'announcementInfo' => $announcementinfo
            ]);
        } catch (\Exception $e) {
            dd($e);
            // Handle decryption failure, you can redirect or return an error message
            return redirect()->back()->with('error', 'Invalid ID');
        }
    }

    public function getOldDescription()
    {
        $oldAnnouncements = $this->AnnouncementService->getExpiredAnnouncements();
        return Inertia::render('PublicPage/Archive', [
            'oldAnnouncements' => $oldAnnouncements
        ]);
    }
}
