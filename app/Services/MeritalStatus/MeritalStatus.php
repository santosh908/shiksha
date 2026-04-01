<?php
namespace App\Services\MeritalStatus;
use App\Models\MeritalStatus;

class MeritalStatusService 
{
   public function getMeritalStatusList()
   {
      return MeritalStatus::all(); // Directly return the result of District::all()
   }
}