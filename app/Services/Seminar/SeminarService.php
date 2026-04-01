<?php
namespace App\Services\Seminar;
use App\Models\Seminar;

class SeminarService
{
   public function getSeminarList()
   {
      return Seminar::all(); 
   }

   public function SeminarList(): array
   {
     $seminarList= [
      'SeminarList' => Seminar::all()->toArray(),
    ];
    return $seminarList;
   }

   public function createSeminar($request): Seminar
   {
      return Seminar::Create( 
         [
             'seminar_name_english' => $request['seminar_name_english'],
             'seminar_name_hindi' => $request['seminar_name_hindi'],
             'is_active' => $request['is_active'],
         ]
     );
   }

   public function updateSeminar($request): Seminar
   {
      //dd($request);
      $seminar=Seminar::where('id', $request->id)->first();

      $seminar->seminar_name_english = $request['seminar_name_english'];
        $seminar->seminar_name_hindi = $request['seminar_name_hindi'];
        $seminar->is_active = $request['is_active'];
        $seminar->save(); // Save changes to the database

        return $seminar;
   }

   public function deleteSeminar($id)
   {
     $seminar = Seminar::find($id);
     
     return $seminar->delete();
     //dd($id);
     //return false;
   }
}