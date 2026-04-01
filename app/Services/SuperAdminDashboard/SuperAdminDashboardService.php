<?php

namespace App\Services\SuperAdminDashboard;

use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\ProfessionalInformation;
use App\Models\User;
use App\Models\ShiksahLavelCompleted;
use App\Models\shiksha_levels;
use Illuminate\Support\Facades\DB;
use App\Models\Examination\Examination;
use App\Models\Examination\ExamSessionModel;
use App\Models\ExamLavelCompleted;
use App\Models\RaiseQuery\RaiseQuery;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;

class SuperAdminDashboardService
{
    public function getTotalCounts()
    {
        // Get the counts from the database
        $asheryLeaderCount = AsheryLeader::where('is_active', 'Y')->count();
        $bhaktiBhishukCount = BhaktiBhekshuk::where('is_active', 'Y')->count();
        // $partiallydevoteeCount = User::where('devotee_type', 'AD')->count();
        $partiallydevoteeCount = User::where('devotee_type', 'AD')
            ->leftJoin('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->where(function ($query) {
                $query->whereNull('professional_information.status_code')
                    ->orWhere('professional_information.status_code', 'N');
            })
            ->count();
        $approvedevoteeCount = ProfessionalInformation::where('status_code', 'A')->count();
        $notapprovedevoteeCount = ProfessionalInformation::where('status_code', 'S')->count();
        $coordinatorCount = User::where('devotee_type', 'CA')->count();

        // Return all counts as an array
        return [
            'asheryLeaderCount' => $asheryLeaderCount,
            'bhaktiBhishukCount' => $bhaktiBhishukCount,
            'partiallydevoteeCount' => $partiallydevoteeCount,
            'approvedevoteeCount' => $approvedevoteeCount,
            'notapprovedevoteeCount' => $notapprovedevoteeCount,
            'coordinatorCount' => $coordinatorCount,
        ];
    }

    public function getExamLevelStatistics()
    {
        $examStats = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->where('shiksah_lavel_completed.is_qualified', 1)
            ->whereNotIn('shiksah_lavel_completed.shiksha_level', [6, 9])
            ->groupBy('shiksha_levels.id', 'shiksha_levels.exam_level')
            ->select('shiksha_levels.id', 'shiksha_levels.exam_level', DB::raw('COUNT(shiksah_lavel_completed.login_id) AS user_count'))
            ->orderBy('shiksha_levels.id')
            ->get();

        return $examStats->map(function ($statexam) {
            return [
                'id' => $statexam->id,
                'exam_level' => $statexam->exam_level,
                'user_count' => $statexam->user_count,
            ];
        });
    }

    // public function getQualifiedUsersForLevelOne($level = null)
    // {
    //     $query = DB::table('shiksah_lavel_completed as sc')
    //     ->join('users', 'users.login_id', '=', 'sc.login_id')
    //     ->join('shiksha_levels', 'shiksha_levels.id', '=', 'sc.shiksha_level')
    //     ->where('sc.is_qualified', 1);
    //     if ($level !== null) {
    //         if ($level == 6 || $level == 7) {
    //             $query->whereIn('sc.shiksha_level', [6, 7]);
    //         } elseif ($level == 8 || $level == 9) {
    //             $query->whereIn('sc.shiksha_level', [8, 9]);
    //         } else {
    //             $query->where('sc.shiksha_level', $level);
    //         }
    //     }
    //     $qualifiedUsers = $query
    //                     ->select([
    //                         'sc.login_id',
    //                         DB::raw('MAX(sc.exam_date) as exam_date'),
    //                         DB::raw('MAX(sc.total_questions) as total_questions'),  // Added MAX here
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT total_marks 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 6
    //                                     LIMIT 1
    //                                 )
    //                             END as level_6_marks
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT total_marks 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 7
    //                                     LIMIT 1
    //                                 )
    //                             END as level_7_marks
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT total_marks 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 8
    //                                     LIMIT 1
    //                                 )
    //                             END as level_8_marks
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT total_marks 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 9
    //                                     LIMIT 1
    //                                 )
    //                             END as level_9_marks
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT SUM(total_marks) 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level IN (6, 7)
    //                                 )
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT SUM(total_marks) 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level IN (8, 9)
    //                                 )
    //                                 ELSE MAX(sc.total_marks)
    //                             END as total_marks
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT total_obtain 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 6
    //                                     LIMIT 1
    //                                 )
    //                             END as level_6_obtain
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT total_obtain 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 7
    //                                     LIMIT 1
    //                                 )
    //                             END as level_7_obtain
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT total_obtain 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 8
    //                                     LIMIT 1
    //                                 )
    //                             END as level_8_obtain
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT total_obtain 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level = 9
    //                                     LIMIT 1
    //                                 )
    //                             END as level_9_obtain
    //                         "),
    //                         DB::raw("
    //                             CASE 
    //                                 WHEN MAX(sc.shiksha_level) IN (6, 7) THEN (
    //                                     SELECT SUM(total_obtain) 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level IN (6, 7)
    //                                 )
    //                                 WHEN MAX(sc.shiksha_level) IN (8, 9) THEN (
    //                                     SELECT SUM(total_obtain) 
    //                                     FROM shiksah_lavel_completed 
    //                                     WHERE login_id = sc.login_id 
    //                                     AND shiksha_level IN (8, 9)
    //                                 )
    //                                 ELSE MAX(sc.total_obtain)
    //                             END as total_obtain
    //                         "),
    //                         'users.name',
    //                         'users.email',
    //                         'users.contact_number',
    //                         DB::raw('MAX(sc.is_qualified) as is_qualified'),
    //                         DB::raw('MAX(sc.shiksha_level) as shiksha_level'),
    //                         DB::raw('MIN(shiksha_levels.exam_level) as exam_level')
    //                     ])
    //                     ->groupBy(
    //                         'sc.login_id',
    //                         'users.name',
    //                         'users.email',
    //                         'users.contact_number'
    //                     )
    //                     ->orderBy('exam_date', 'desc')
    //                     ->get();

    //     return $qualifiedUsers;
    // }

    public function getQualifiedUsersForLevelOne($level = null)
    {
        // First query: Get basic user information and their qualification status
        $baseQuery = DB::table('shiksah_lavel_completed as sc')
            ->join('users', 'users.login_id', '=', 'sc.login_id')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'sc.shiksha_level')
            ->where('sc.is_qualified', 1);

        // Apply level filtering if needed
        if ($level !== null) {
            if ($level == 6 || $level == 7) {
                $baseQuery->whereIn('sc.shiksha_level', [6, 7]);
            } elseif ($level == 8 || $level == 9) {
                $baseQuery->whereIn('sc.shiksha_level', [8, 9]);
            } else {
                $baseQuery->where('sc.shiksha_level', $level);
            }
        }

        // Get base user data with aggregations
        $baseUsers = $baseQuery
            ->select([
                'sc.login_id',
                'users.name',
                'users.initiated_name',
                'users.email',
                'users.contact_number',
                DB::raw('MAX(sc.exam_date) as exam_date'),
                DB::raw('MAX(sc.total_questions) as total_questions'),
                DB::raw('MAX(sc.is_qualified) as is_qualified'),
                DB::raw('MAX(sc.shiksha_level) as shiksha_level'),
                DB::raw('MIN(shiksha_levels.exam_level) as exam_level')
            ])
            ->groupBy(
                'sc.login_id',
                'users.name',
                'users.initiated_name',
                'users.email',
                'users.contact_number'
            )
            ->orderBy('exam_date', 'desc')
            ->get();

        // If no users found, return empty collection
        if ($baseUsers->isEmpty()) {
            return collect([]);
        }

        // Extract login IDs for the second query
        $loginIds = $baseUsers->pluck('login_id')->toArray();

        // Second query: Get all relevant marks data in one go for the filtered users
        $marksData = DB::table('shiksah_lavel_completed')
            ->whereIn('login_id', $loginIds)
            ->select([
                'login_id',
                'shiksha_level',
                'total_marks',
                'total_obtain'
            ])
            ->get();

        // Organize marks data by login_id and shiksha_level for efficient lookup
        $organizedMarksData = [];
        foreach ($marksData as $mark) {
            $organizedMarksData[$mark->login_id][$mark->shiksha_level] = [
                'total_marks' => $mark->total_marks,
                'total_obtain' => $mark->total_obtain
            ];
        }

        // Calculate summaries by level groups
        $levelSummaries = [];
        foreach ($loginIds as $loginId) {
            $userData = $marksData->where('login_id', $loginId);

            // Sum for levels 6-7
            $level67Data = $userData->whereIn('shiksha_level', [6, 7]);
            $levelSummaries[$loginId]['6-7'] = [
                'total_marks_sum' => $level67Data->sum('total_marks'),
                'total_obtain_sum' => $level67Data->sum('total_obtain')
            ];

            // Sum for levels 8-9
            $level89Data = $userData->whereIn('shiksha_level', [8, 9]);
            $levelSummaries[$loginId]['8-9'] = [
                'total_marks_sum' => $level89Data->sum('total_marks'),
                'total_obtain_sum' => $level89Data->sum('total_obtain')
            ];
        }

        // Map the base users with the additional calculated fields
        return $baseUsers->map(function ($user) use ($organizedMarksData, $levelSummaries) {
            $loginId = $user->login_id;
            $userData = $organizedMarksData[$loginId] ?? [];
            $userLevel = $user->shiksha_level;

            // Add level specific marks
            $user->level_6_marks = $userData[6]['total_marks'] ?? null;
            $user->level_7_marks = $userData[7]['total_marks'] ?? null;
            $user->level_8_marks = $userData[8]['total_marks'] ?? null;
            $user->level_9_marks = $userData[9]['total_marks'] ?? null;

            // Add level specific obtains
            $user->level_6_obtain = $userData[6]['total_obtain'] ?? null;
            $user->level_7_obtain = $userData[7]['total_obtain'] ?? null;
            $user->level_8_obtain = $userData[8]['total_obtain'] ?? null;
            $user->level_9_obtain = $userData[9]['total_obtain'] ?? null;

            // Add total marks and obtains based on user's level
            if ($userLevel == 6 || $userLevel == 7) {
                $user->total_marks = $levelSummaries[$loginId]['6-7']['total_marks_sum'];
                $user->total_obtain = $levelSummaries[$loginId]['6-7']['total_obtain_sum'];
            } elseif ($userLevel == 8 || $userLevel == 9) {
                $user->total_marks = $levelSummaries[$loginId]['8-9']['total_marks_sum'];
                $user->total_obtain = $levelSummaries[$loginId]['8-9']['total_obtain_sum'];
            } else {
                // For other levels, use the specific level data
                $user->total_marks = $userData[$userLevel]['total_marks'] ?? null;
                $user->total_obtain = $userData[$userLevel]['total_obtain'] ?? null;
            }

            return $user;
        });
    }

    public function showmessage($request)
    {
        if ($request->has('query_id')) {
            // Get complete chat history for the query_id including both user and SuperAdmin messages
            $chatHistory = RaiseQuery::where('raise_queries.query_id', $request->query_id)
                ->leftJoin('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'raise_queries.id',
                    'raise_queries.description as content',
                    DB::raw('COALESCE(users.name, "SuperAdmin") as sender'), // Use SuperAdmin name if no user found
                    'raise_queries.from_id as senderId',
                    'raise_queries.created_at as timestamp',
                    DB::raw('CASE WHEN raise_queries.from_id = "SuperAdmin" THEN true ELSE false END as isOutgoing'),
                    'raise_queries.query_id'
                )
                ->orderBy('raise_queries.created_at', 'asc')
                ->get();

            // Get all messages for the table view
            $messages = RaiseQuery::join('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'users.name',
                    'users.devotee_type',
                    'raise_queries.*'
                )
                ->where('raise_queries.from_id', '!=', 'SuperAdmin') // Only show initial user messages in table
                ->orderBy('raise_queries.id', 'desc')
                ->get();

            return [
                'messages' => $messages,
                'chatHistory' => $chatHistory
            ];
        }

        $user = Auth::user();
        $roles = $user->getRoleNames();
        $role = $roles->first();
        if ($role == "Admin" || $role == "SuperAdmin") {
            // Get all messages for the table view
            $messages = RaiseQuery::join('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'users.name',
                    'users.devotee_type',
                    'raise_queries.*'
                )
                ->where('raise_queries.from_id', '!=', 'SuperAdmin') // Only show initial user messages in table
                ->orderBy('raise_queries.id', 'desc')
                ->get();
            return $messages;
        } else {
            $messages = RaiseQuery::join('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'users.name',
                    'users.devotee_type',
                    'raise_queries.*'
                )
                ->where(function ($query) use ($user) {
                    $query->where('raise_queries.from_id', $user->login_id)
                        ->orWhere('raise_queries.to_id', $user->login_id);
                })
                ->orderBy('raise_queries.id', 'desc')
                ->get();

            return $messages;
        }
    }

    public function storemessage($request)
    {
        $messageData = [
            'subject' => $request->subject,
            'description' => $request->description,
            'from_id' => 'SuperAdmin',
            'to_id' => $request->to_id,
            'query_id' => $request->query_id,
            'is_viewed' => false
        ];

        $message = RaiseQuery::create($messageData);
        // Return complete updated chat history
        return RaiseQuery::where('raise_queries.query_id', $request->query_id)
            ->leftJoin('users', 'users.login_id', '=', 'raise_queries.from_id')
            ->select(
                'raise_queries.id',
                'raise_queries.description as content',
                DB::raw('COALESCE(users.name, "SuperAdmin") as sender'),
                'raise_queries.from_id as senderId',
                'raise_queries.created_at as timestamp',
                DB::raw('CASE WHEN raise_queries.from_id = "SuperAdmin" THEN true ELSE false END as isOutgoing'),
                'raise_queries.query_id'
            )
            ->orderBy('raise_queries.created_at', 'asc')
            ->get();
    }
}
