<?php

namespace App\Services\Announcement;
use App\Models\Announcements;
use Carbon\Carbon;

class AnnouncementService
{
    
    public function createAnnouncement($request)
    {
        $validUpto = date('Y-m-d H:i:s', strtotime($request->valid_upto));
        return Announcements::Create(
            [
                'title' => $request['title'],
                'description' => $request['description'],
                'valid_upto' => $validUpto,
                'display_sequence' => $request['display_sequence'],
                'is_active' => $request['is_active'],
            ]
        );
    }
    public function AnnouncementList()
    {
      $AnnouncementList = [
            'AnnouncementList' => Announcements::whereIn('is_active', ['Y', 'N'])
            ->orderBy('display_sequence', 'asc')
            ->get()
            ->toArray(),
      ];
      //dd($AnnouncementList);
        
      return $AnnouncementList;
    }

    public function updateAnnouncement($request)
    {
         //dd($request);
         $announcement=Announcements::where('id', $request->id)->first();
 
         $announcement->title = $request['title'];
         $announcement->description = $request['description'];
         $announcement->valid_upto = $request['valid_upto'];
         $announcement->is_active = $request['is_active'];
         $announcement->display_sequence = $request['display_sequence'];
         $announcement->save(); // Save changes to the database
 
         return $announcement;
    }
 
    public function deleteAnnouncement($id)
    {
      $announcement = Announcements::find($id);
      
      return $announcement->delete();
      //dd($id);
      //return false;
    }
    public function AnnouncementsDescription($id)
    {
        $announcement = Announcements::select('title', 'description', 'created_at')
        ->where('id', $id)
        ->first();

        return $announcement; 
    }

    public function getArchiveByID($id)
    {
        $announcement = Announcements::select('title', 'description', 'created_at')
        ->where('id', $id)
        ->first();
        if ($announcement) {
            return $announcement->toArray(); // Convert to array if found
        } else {
            return null; // Return null or handle it accordingly if not found
        }
    }
    public function getExpiredAnnouncements()
    {
        $currentDate = Carbon::now(); 
        // $announcement =  Announcements::select('title', 'description', 'created_at')  // Select specific fields
        // ->where('valid_upto', '<', $currentDate)
        // ->orderBy('valid_upto', 'desc')  // Order by the valid_upto date in descending order
        // ->get()
        // ->toArray(); 
    
        // return $announcement; 
        $expiredAnnouncements = Announcements::select('id','title', 'description', 'valid_upto', 'created_at')  // Select specific fields
        ->where('valid_upto', '<', $currentDate) // Compare valid_upto with current date
        ->orderBy('valid_upto', 'desc') // Order by expiry date in descending order
        ->get(); // Get all matching records

        return $expiredAnnouncements->toArray();
    }

    
}
