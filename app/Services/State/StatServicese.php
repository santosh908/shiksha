<?php

namespace App\Services\State;
use App\Models\State;

class StatServicese 
{
   public function getStateList()
   {
      return State::all(); // Directly return the result of State::all()
   }
}