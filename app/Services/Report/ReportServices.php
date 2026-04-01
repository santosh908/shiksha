<?php

namespace App\Services\Report;

use App\Models\User;
use App\Models\DevoteeBookRead;
use App\Models\DevoteeAttendedSeminar;
use App\Models\DevoteeMemoriesPrayer;
use App\Models\DevoteePrinciples;
use App\Models\ExamLavelCompleted;
use App\Models\ShikshaLevel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\UserAssignAshrayLeader;

class ReportServices
{

    public function DevoteeWithALlDetails()
    {
        return DB::table('devotee_with_all_details_view')->get();
    }

    public  function DevoteeBook($professional_id)
    {
        $books = DevoteeBookRead::join('book', 'book.id', '=', 'devotee_book.book_id')
            ->where('devotee_book.personal_info_id', '=', $professional_id)
            ->pluck('book.book_name_english')   // fetch only the book names
            ->implode(', ');
        return $books;
    }

    public function DevoteeSeminarList($professional_id)
    {
        $DevoteeSeminarList = DevoteeAttendedSeminar::join('seminar', 'seminar.id', '=', 'devotee_attended_seminar.seminar_id')
            ->where('devotee_attended_seminar.personal_info_id', '=', $professional_id)
            ->pluck('seminar.seminar_name_english')   // fetch only the book names
            ->implode(', ');
        return $DevoteeSeminarList;
    }

    public function DevoteeMemorisePrayers($professional_id)
    {
        $MemorisePrayers = DevoteeMemoriesPrayer::join('prayer', 'prayer.id', '=', 'devotee_memorised_prayers.prayer_id')
            ->where('devotee_memorised_prayers.personal_info_id', '=', $professional_id)
            ->pluck('prayer.prayer_name_english')   // fetch only the book names
            ->implode(', ');
        return $MemorisePrayers;
    }

    public function DevoteeRegulativePrinciple($professional_id)
    {
        $RegulativePrinciples = DevoteePrinciples::join('regulative_principle', 'regulative_principle.id', '=', 'devotee_principles.principle_id')
            ->where('devotee_principles.personal_info_id', '=', $professional_id)
            ->pluck('regulative_principle.principle_name_eglish')   // fetch only the book names
            ->implode(', ');
        return $RegulativePrinciples;
    }

    // app/Services/Report/ReportServices.php
    public function DevoteeNextExamLevel()
    {
        // Fetch users from the view
        $list = DB::table('devotee_next_exam_level_view')->get();

        // Attach next level and exam level details
        $list = $list->map(function ($item) {
            $item->next_level = $this->getNextShikshaLevel($item->login_id);
            $examLevels = $this->getDevoteeExamLevels($item->login_id);

            foreach ($examLevels as $key => $value) {
                $item->$key = $value;
            }

            return $item;
        });
        return $list;
    }

    public function DevoteeVewProfile()
    {
        // Fetch users from the view
        $query = DB::table('devotee_next_exam_level_view');

        $user = Auth::user();
        if ($user instanceof User && $user->hasRole('AsheryLeader')) {
            $leader = AsheryLeader::where('user_id', $user->id)->first();
            if ($leader) {
                $assignedLoginIds = UserAssignAshrayLeader::where('ashray_leader_code', $leader->code)
                    //->where('Bhakti_Bhekshuk', 0)
                    ->join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
                    ->where('user_have_ashray_leader.Bhakti_Bhekshuk', '=', '0')
                    ->pluck('users.login_id')
                    ->toArray();

                $query->whereIn('login_id', $assignedLoginIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        }
        if ($user instanceof User && $user->hasRole('BhaktiVriksha')) {
            $Vleader = BhaktiBhekshuk::where('user_id', $user->id)->first();
            if ($Vleader) {
                $assignedLoginIds = UserAssignAshrayLeader::where('Bhakti_Bhekshuk', $Vleader->id)
                    ->join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
                    ->pluck('users.login_id')
                    ->toArray();
                $query->whereIn('login_id', $assignedLoginIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $list = $query->get();

        // Attach next level and exam level details
        $list = $list->map(function ($item) {
            $item->next_level = $this->getNextShikshaLevel($item->login_id);
            $examLevels = $this->getDevoteeExamLevels($item->login_id);

            foreach ($examLevels as $key => $value) {
                $item->$key = $value;
            }

            return $item;
        });
        return $list;
    }

    public function getDevoteeExamLevels($loginId)
    {
        $examLevels = ExamLavelCompleted::from('shiksah_lavel_completed as elc')
            ->join('shiksha_levels as sl', 'elc.shiksha_level', '=', 'sl.id')
            ->where('elc.login_id', $loginId)
            ->whereNotIn('elc.shiksha_level', [8, 9])
            ->select('elc.*', 'sl.exam_level as level_name')
            ->orderBy('elc.shiksha_level')
            ->get();

        $levelDetails = [];

        foreach ($examLevels as $level) {
            $levelNumber = $level->shiksha_level;
            $levelDetails["level_{$levelNumber}_total_marks"] = $level->total_marks ?? 0;
            $levelDetails["level_{$levelNumber}_obtained_marks"] = $level->total_obtain ?? 0;
            $levelDetails["level_{$levelNumber}_is_qualified"] = $level->is_qualified ?? 'N';
            $levelDetails["level_{$levelNumber}_exam_date"] = $level->exam_date ?? '';
            $levelDetails["level_{$levelNumber}_name"] = $level->level_name ?? "Level {$levelNumber}";
        }

        // Calculate Next Level to show as Pending
        $qualifiedLevels = $examLevels->where('is_qualified', '1')->pluck('shiksha_level')->toArray();
        $highestQualified = !empty($qualifiedLevels) ? max($qualifiedLevels) : 0;
        $nextLevelId = $highestQualified == 0 ? 1 : $highestQualified + 1; // Default to 1 if none qualified? Or just +1. 
        // If 0 qualified, next is 1. If 1 qualified, next is 2.

        // Handle special case: if qualified level is up to 5, skip level 6 and show level 7
        if ($highestQualified <= 5 && $nextLevelId == 6) {
            $nextLevelId = 7;
        }

        while (in_array($nextLevelId, [8, 9])) {
            $nextLevelId++;
        }

        if (!isset($levelDetails["level_{$nextLevelId}_total_marks"])) {
            $nextLevelName = ShikshaLevel::where('id', $nextLevelId)->value('exam_level');
            if ($nextLevelName) {
                $levelDetails["level_{$nextLevelId}_status"] = 'Next';
                $levelDetails["level_{$nextLevelId}_name"] = $nextLevelName;
            }
        }

        return $levelDetails;
    }

    public function getNextShikshaLevel($loginId)
    {
        $levels = ExamLavelCompleted::where('login_id', $loginId)
            ->whereNotIn('shiksha_level', [8, 9])
            ->orderBy('shiksha_level')
            ->get();

        $qualifiedLevels = $levels->filter(fn($l) => $l->is_qualified == "1")->pluck('shiksha_level')->toArray();

        // Level name mapping (skip level 1 - Intractive)
        $levelNames = [
            2 => 'Shraddhavan',
            3 => 'Krishna Sevak',
            4 => 'Krishna Sadhak',
            5 => 'Shrila Prabhupada Ashray',
            6 => 'Assignment Submission-GPA',
            7 => 'Gurupada Ashray',
        ];

        // If level 7 is qualified, show 'You have all level completed'
        if (in_array(7, $qualifiedLevels)) {
            return 'You have all level completed';
        }

        // Find all unqualified levels
        $allLevels = [2, 3, 4, 5, 6, 7];
        $unqualifiedLevels = array_diff($allLevels, $qualifiedLevels);

        // Find missing levels: unqualified levels that are less than the highest qualified level
        $missingLevels = [];
        if (!empty($qualifiedLevels)) {
            $highestQualified = max($qualifiedLevels);
            $missingLevels = array_filter($unqualifiedLevels, function($lvl) use ($highestQualified) {
                return $lvl < $highestQualified;
            });
        }

        // Get the first unqualified level as next level
        $nextLevel = min($unqualifiedLevels);
        $nextLevelName = isset($levelNames[$nextLevel]) ? $levelNames[$nextLevel] : "Level {$nextLevel}";

        // If there are missing levels, show both missing and next level
        if (!empty($missingLevels)) {
            $missingNames = array_map(function($lvl) use ($levelNames) {
                return isset($levelNames[$lvl]) ? $levelNames[$lvl] : "Level {$lvl}";
            }, $missingLevels);
            return 'Missing Levels: ' . implode(', ', $missingNames) . '. Next Level: ' . $nextLevelName;
        }

        // If no missing levels, just show next level
        return 'Next Level: ' . $nextLevelName;
    }
}
