<?php
namespace App\Services\ExamLavelMaster\ExamLavelMasterServices;
use App\Models\ShikshlaLavelMaster;

class ExamLavelMasterServices 
{
   public function getExamLavelMaster()
   {
      return ShikshlaLavelMaster::all(); 
   }
}