<?php
namespace App\Services\MeritalStatus;
use App\Models\MeritalStatus;

class MeritalStatusService 
{
   // public function getMeritalStatusList()
   // {
   //    return MeritalStatus::all(); // Directly return the result of District::all()
   // }

   public function createMeritalstatus($request)
   {
      return Meritalstatus::Create( 
         [
             'merital_status_name' => $request['merital_status_name'],
             'is_active' => $request['is_active'],
         ]
     );
   }

   public function MeritalStatusList()
   {
     $MeritalStatusList = [
         'MeritalStatusList' => Meritalstatus::all()->toArray(),
     ];

     return $MeritalStatusList;
   }

   public function updateMeritalStatus($request): MeritalStatus
   {

    $meritalstatus=Meritalstatus::where('id', $request->id)->first();

        $meritalstatus->merital_status_name = $request['merital_status_name'];
        $meritalstatus->is_active = $request['is_active'];
        $meritalstatus->save(); // Save changes to the database

        return $meritalstatus;
   }

   public function deleteMeritalStatus($id)
   {
      $meritalstatus = Meritalstatus::find($id);
     
       return $meritalstatus->delete();
   }

}