<?php
namespace App\Services\Education;
use App\Models\Education;

class EducationService 
{
   // public function getEducationtList()
   // {
   //    return Education::all(); // Directly return the result of District::all()
   // }

   public function createEducation($request)
   {
      return Education::Create( 
         [
             'eduction_name' => $request['eduction_name'],
             'is_active' => $request['is_active'],
         ]
     );
   }
   
   public function EducationList()
   {
     $EducationList = [
         'EducationList' => Education::all()->toArray(),
     ];

     return $EducationList;
   }

   public function updateEducation($request): Education
   {
      $education = Education::where('id', $request->id)->first();

        $education->eduction_name = $request['eduction_name'];
        $education->is_active = $request['is_active'];
        $education->save();

        return $education;
   }

   public function deleteEducation($id)
   {
     $education = Education::find($id);
     
     return $education->delete();
     //dd($id);
     //return false;
   }
}