<?php
namespace App\Services\Profession;
use App\Models\Profession;

class ProfessionService 
{
   // public function getProfessionList()
   // {
   //    return Profession::all(); // Directly return the result of District::all()
   // }

   public function createProfession($request)
   {
      return Profession::Create( 
         [
             'profession_name' => $request['profession_name'],
             'is_active' => $request['is_active'],
         ]
     );
   }

   public function ProfessionList()
   {
     $ProfessionList = [
         'ProfessionList' => Profession::all()->toArray(),
     ];

     return $ProfessionList;
   }

   public function updateProfession($request): Profession
   {
        //dd($request);
        $profession=Profession::where('id', $request->id)->first();

        $profession->profession_name = $request['profession_name'];
        $profession->is_active = $request['is_active'];
        $profession->save(); // Save changes to the database

        return $profession;
   }

   public function deleteProfession($id)
   {
     $profession = Profession::find($id);
     
     return $profession->delete();
     //dd($id);
     //return false;
   }
}
