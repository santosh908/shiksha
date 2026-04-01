<?php
namespace App\Services\ShikshaLavel;
use App\Models\ExamLavelCompleted;
use App\Models\User;

class ShikshaLavelServices
{
   public function getIntractiveExamResult($userId)
   {
      return  
         ['Intractive' => User::join('interactive__exams', 'Users.login_id','=','interactive__exams.login_id')
         ->join('shiksha_levels','shiksha_levels.id','=','interactive__exams.shiksha_level')
         ->join('user_have_ashray_leader','user_have_ashray_leader.user_id','=','Users.id')
         ->join('ashery_leader','ashery_leader.code','=','user_have_ashray_leader.ashray_leader_code')
         ->select('interactive__exams.*','shiksha_levels.exam_level as Lavel_Name','ashery_leader.ashery_leader_name','shiksha_levels.id as shiksha_level')
         ->where('Users.login_id', '=', $userId)
         ->get() 
         ->toArray(),
        // 'SradhawanResult' => District::orderBy('district_name', 'asc')->get()->toArray(),
      ];
   }
}