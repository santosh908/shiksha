<?php

namespace App\Services\SessionResult;

use App\Models\AsheryLeader;
use Illuminate\Support\Facades\DB;
use App\Models\Examination\Examination;
use App\Models\Examination\ExamSessionModel;
use Illuminate\Support\Facades\Auth;

class SessionResultServices
{
    public function getSessionResultList($session = null)
    {
        $query = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'shiksah_lavel_completed.ashray_leader_code')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->join('examinations', 'examinations.id', '=', 'shiksah_lavel_completed.exam_id')
            ->join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'users.name',
                'users.email',
                'users.Initiated_name',
                'users.contact_number',
                'examinations.exam_session'
            ]);

        // Filter by exam session ID
        if ($session) {
            $query->where('exam_session.id', $session);
        }

        return $query->get()->toArray();
    }

    public function getAsherySessionResultList($session = null)
    {
        $user = Auth::User();
        $asheryLeader = DB::table('ashery_leader')
            ->where('user_id', $user->id)
            ->first();
        //$ahserycode=AsheryLeader::where('user_id','=',$userid)->get()
        //dd($session);
        $query = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'shiksah_lavel_completed.ashray_leader_code')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->join('examinations', 'examinations.exam_session', '=', 'shiksah_lavel_completed.exam_id')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
            ])
            ->where('ashery_leader.code', '=', $asheryLeader->code);

        // Filter by exam session ID
        if ($session) {
            $query->where('shiksah_lavel_completed.exam_id', $session);
        }

        return $query->get()->toArray();
    }
    public function ExamSessionList()
    {
        // Get unique exam sessions with their names
        return DB::table('exam_session')
            // ->join('examinations', 'examinations.exam_session', '=', 'exam_session.id')
            ->select('exam_session.id', 'exam_session.session_name')
            ->get()
            ->toArray();
    }

    public function getBhaktiBhikshukSessionResultList($session = null)
    {
        $user = Auth::User();
        $bhaktibhikshuk = DB::table('bhakti_bhekshuk')
            ->where('user_id', $user->id)
            ->first();
        //$ahserycode=AsheryLeader::where('user_id','=',$userid)->get()
        //dd($session);
        $query = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'shiksah_lavel_completed.ashray_leader_code')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->join('examinations', 'examinations.exam_session', '=', 'shiksah_lavel_completed.exam_id')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
            ])
            ->where('bhakti_bhekshuk.user_id', '=', $bhaktibhikshuk->user_id);

        // Filter by exam session ID
        if ($session) {
            $query->where('shiksah_lavel_completed.exam_id', $session);
        }

        return $query->get()->toArray();
    }
}
