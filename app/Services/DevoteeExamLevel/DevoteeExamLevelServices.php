<?php
namespace App\Services\DevoteeExamLevel;
use App\Models\ExamLavelCompleted;
use Illuminate\Support\Facades\DB;

class DevoteeExamLevelServices
{
   public function getDevoteeResult($userId)
   {
      $list = ExamLavelCompleted::join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
      ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
      ->join('user_have_ashray_leader', 'user_have_ashray_leader.user_id', '=', 'users.id')
      ->join('ashery_leader', 'ashery_leader.code', '=', 'user_have_ashray_leader.ashray_leader_code')
      ->leftJoin('bhakti_bhekshuk', 'bhakti_bhekshuk.id', '=', 'user_have_ashray_leader.Bhakti_Bhekshuk')
      ->leftJoin('examinations','examinations.id','=','shiksah_lavel_completed.exam_id')
      ->leftJoin('exam_session','exam_session.id','=','examinations.exam_session')
      ->select([
          'shiksha_levels.exam_level',
          'users.name',
          'ashery_leader.ashery_leader_name',
          'shiksah_lavel_completed.*',
          'exam_session.session_name as SessionName',
          'shiksha_levels.exam_level as ShikshaLevel',
          'examinations.id as exam_id',
          'examinations.date as ExamDate',
          DB::raw('CASE 
              WHEN user_have_ashray_leader.Bhakti_Bhekshuk != 0 
              THEN bhakti_bhekshuk.bhakti_bhikshuk_name 
              ELSE NULL 
          END as bhakti_bhekshuk_name')
      ])
      ->where('shiksah_lavel_completed.login_id', '=', $userId)
      ->where(function ($query) {
        $query->where('shiksah_lavel_completed.is_promoted_by_ashray_leader', '!=', 1)
              ->orWhereDate('examinations.date', '<=', now()); // Include only if ExamDate is today or past
        })
      ->get()
      ->toArray();
      //dd($list);
      return $list;
   }
}