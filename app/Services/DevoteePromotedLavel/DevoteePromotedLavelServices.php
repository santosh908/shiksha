<?php

namespace App\Services\DevoteePromotedLavel;

use Illuminate\Support\Facades\DB;
use App\Models\ExamLavelCompleted;
use App\Models\Examination\ExamSessionModel;
use App\Models\ShikshaLevel;
use App\Models\Examination\Examination;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DevoteePromotedLavelServices
{

    public function getDevoteePromotedLavel($userId)
    {
        $list = ExamLavelCompleted::join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->join('user_have_ashray_leader', 'user_have_ashray_leader.user_id', '=', 'users.id')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'user_have_ashray_leader.ashray_leader_code')
            ->leftJoin('bhakti_bhekshuk', 'bhakti_bhekshuk.id', '=', 'user_have_ashray_leader.Bhakti_Bhekshuk')
            ->leftJoin('examinations', 'examinations.id', '=', 'shiksah_lavel_completed.exam_id')
            ->leftJoin('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
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
            ->where('shiksah_lavel_completed.is_qualified', '=', 1)
            ->orderBy('shiksah_lavel_completed.shiksha_level', 'DESC')
            ->whereNotIn('shiksha_levels.id', [1, 6, 8,9])
            ->get()
            ->toArray();
        return $list;
    }

    public function getDevoteeExamination($loginID)
    {
        $qualifiedUsers = DB::table('examinations')
            ->join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
            ->leftJoin('submited_exam', function ($join) {
                $join->on('submited_exam.exam_id', '=', 'examinations.id')
                    ->where('submited_exam.user_id', Auth::user()->id);
            })
            ->leftJoin('final_submited', function ($join) {
                $join->on('final_submited.exam_id', '=', 'examinations.id')
                    ->where('final_submited.user_id', Auth::id());
            })
            ->select(
                'exam_session.session_name',
                'shiksha_levels.exam_level as level_name',
                'examinations.*',
                DB::raw('IF(final_submited.is_submitted = 1, true, false) as isFinalSubmited')
            )
            ->where('examinations.is_active', 'Y') // Only active exams
            // ->where('examinations.date', '>=', Carbon::today()) // Exams happening today or later
            ->where(function ($query) {
                $query->whereNull('final_submited.is_submitted')
                    ->orWhere('final_submited.is_submitted', 0);
            })
            ->distinct()
            ->get();
        return $qualifiedUsers;
    }
}
