<?php
namespace App\Services\District;
use App\Models\Dictrict;

class StatServicese 
{
   public function getDistrictList()
   {
      return District::all(); // Directly return the result of District::all()
   }
}