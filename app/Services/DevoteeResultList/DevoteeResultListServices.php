<?php

namespace App\Services\DevoteeResultList;

use Illuminate\Support\Facades\DB;
use App\Models\ExamLavelCompleted;
use App\Models\UserAssignAshrayLeader;
use Illuminate\Support\Facades\Auth;
use App\Models\Examination\ApproveRejectLevel;
use App\Models\AsheryLeader;
use App\Models\Examination\Examination;
use App\Models\User;
use App\Models\Examination\ExamSessionModel;
use App\Models\ShikshaLevel;
use App\Models\QuestionBank\QuestionBank;
use PhpOffice\PhpSpreadsheet\IOFactory;

use function Pest\Laravel\get;

class DevoteeResultListServices
{
    public function getDevoteeResultList()
    {
        $completedLevels = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->join('user_have_ashray_leader', 'user_have_ashray_leader.user_id', '=', 'users.id')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'user_have_ashray_leader.ashray_leader_code')
            ->leftJoin('approval_for_next_level', 'approval_for_next_level.exam_id', '=', 'shiksah_lavel_completed.exam_id')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'approval_for_next_level.IsAllowed',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
            ])
            ->get()
            ->toArray();
        return $completedLevels;
    }

    public function getAsheryDevoteeResultList()
    {
        $user = Auth::User();
        $asheryLeader = DB::table('ashery_leader')
            ->where('user_id', $user->id)
            ->first();
        $completedLevels = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'shiksah_lavel_completed.ashray_leader_code')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
            ])
            ->where('ashery_leader.code', '=', $asheryLeader->code)
            ->get()
            ->toArray();

        return $completedLevels;
    }

    public function getBhaktiBhikshukDevoteeResultList()
    {
        $user = Auth::User();
        $bhaktibhikshuk = DB::table('bhakti_bhekshuk')
            ->where('user_id', $user->id)
            ->first();
        $completedLevels = DB::table('shiksah_lavel_completed')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'shiksah_lavel_completed.ashray_leader_code')
            ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
            ->select([
                'shiksah_lavel_completed.*',
                'shiksha_levels.exam_level',
                'ashery_leader.ashery_leader_name',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
            ])
            // ->where('shiksah_lavel_completed.login_id', 'AAD006110209')
            ->where('bhakti_bhekshuk.user_id', '=', $bhaktibhikshuk->user_id)
            ->get()
            ->toArray();

        return $completedLevels;
    }

    public function resultAloowPrevent($request)
    {
        $exam = Examination::where('exam_level', $request['shiksha_level'])
            ->orderBy('created_at', 'desc')
            ->first();

        $list = ApproveRejectLevel::updateOrCreate(
            [
                'login_id' => $request['login_id'],
                'exam_id' => $exam->id,
                'shiksha_level' => $request['shiksha_level'],
            ],
            [
                'IsAllowed' => $request['is_qualified'],
            ]
        );
        $user = User::where('login_id', $request['login_id'])->first();
        $asheryLeader = UserAssignAshrayLeader::where('user_id', $user->id)->first();

        $existingRecord = DB::table('shiksah_lavel_completed')
            ->where('login_id', $request['login_id'])
            ->where('shiksha_level', $request['shiksha_level'])
            ->where('exam_id', $exam->id)
            ->first();

        if ($existingRecord) {
            DB::table('shiksah_lavel_completed')
                ->where('login_id', $request['login_id'])
                ->where('shiksha_level', $request['shiksha_level'])
                ->where('exam_id', $exam->id)
                ->update([
                    'ashray_leader_code' => $asheryLeader->ashray_leader_code,
                    'is_qualified' => '0',
                    'is_promoted_by_ashray_leader' => $request['is_qualified'],
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('shiksah_lavel_completed')
                ->insert([
                    'login_id' => $request['login_id'],
                    'shiksha_level' => $request['shiksha_level'],
                    'exam_id' => $exam->id,
                    'ashray_leader_code' => $asheryLeader->ashray_leader_code,
                    'is_qualified' => '0',
                    'is_promoted_by_ashray_leader' => $request['is_qualified'] == 'Y' ? '1' : '0',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
        }
        return $existingRecord;
    }

    public function addPublishResult($request)
    {
        //dd($request);
        $resultId = $request->input('resultId');
        $results = $request->input('results');
        $processedResults = [];
        foreach ($results as $result) {
            $examDetails = DB::table('examinations')
                ->where('id', $result['exam_id'])
                ->first();
            $this->getSessionName($examDetails->exam_session);
            if ($examDetails) {
                $result['exam_details'] = [
                    'exam_session' => $examDetails->exam_session,
                    'exam_level' => $examDetails->exam_level,
                    'date' => $examDetails->date,
                    'start_time' => $examDetails->start_time,
                    'duration' => $examDetails->duration,
                    'no_of_question' => $examDetails->no_of_question,
                    'total_marks' => $examDetails->total_marks,
                    'qualifying_marks' => $examDetails->qualifying_marks
                ];
                $questionIds = array_column($result['allquestion'], 'question_id');
                $questionDetails = DB::table('questionbank')
                    ->whereIn('id', $questionIds)
                    ->get()
                    ->keyBy('id');
                $totalObtain = 0;
                foreach ($result['allquestion'] as &$question) {
                    if (isset($questionDetails[$question['question_id']])) {
                        $qDetails = $questionDetails[$question['question_id']];
                        $question['question_details'] = [
                            'question_english' => $qDetails->question_english,
                            'question_hindi' => $qDetails->question_hindi,
                            'option1' => $qDetails->option1,
                            'option2' => $qDetails->option2,
                            'option3' => $qDetails->option3,
                            'option4' => $qDetails->option4,
                            'correctanswer' => $qDetails->correctanswer,
                        ];

                        if ($question['selected_answer_id'] === $qDetails->correctanswer) {
                            $totalObtain = $totalObtain + 1;
                        }
                    }
                }
                //dd($request->toArray(),$totalObtain);
                // Check if student qualified
                $isQualified = ($totalObtain >= $examDetails->qualifying_marks) ? 1 : 0;
                $certificateIssued = $isQualified ? 1 : 0;
                $existingRecord = DB::table('shiksah_lavel_completed')
                    ->where('login_id', $result['login_id'])
                    ->where('exam_id', $result['exam_id'])
                    ->where('shiksha_level', $result['level'])
                    ->first();
                $recordData = [
                    'login_id' => $result['login_id'],
                    'shiksha_level' => $result['level'],
                    'exam_date' => $examDetails->date,
                    'total_questions' => $examDetails->no_of_question,
                    'total_marks' => $examDetails->total_marks,
                    'total_obtain' => $totalObtain,
                    'is_qualified' => $isQualified,
                    'certificate_issued' => $certificateIssued,
                    'certificate_number' => $isQualified == 1 ? $this->getCertificateName($examDetails->exam_level, $examDetails->exam_session, $result['exam_id']) : 0,
                    'ashray_leader_code' => $result['ashray_leader_code'],
                    'exam_id' => $result['exam_id'],
                    'updated_at' => now()
                ];

                if ($existingRecord) {
                    // Update existing record
                    DB::table('shiksah_lavel_completed')
                        ->where('login_id', $result['login_id'])
                        ->where('exam_id', $result['exam_id'])
                        ->where('shiksha_level', $result['level'])
                        ->update($recordData);
                } else {
                    // Insert new record
                    $recordData['created_at'] = now();
                    DB::table('shiksah_lavel_completed')->insert($recordData);
                }

                $processedResults[] = $result;
            }
        }
        return [
            'status' => 'success',
            'message' => 'Results processed successfully!',
            'resultId' => $resultId,
            'processedResults' => $processedResults,
            'processedResultsCount' => count($processedResults),
        ];
    }

    public function getCertificateName($levelId, $sessionID, $examID)
    {
        $fileName = "";
        $lastRecord = ExamLavelCompleted::join('examinations', 'examinations.id', '=', 'shiksah_lavel_completed.exam_id')
            ->where('examinations.exam_session', $sessionID)
            ->where('examinations.exam_level', $levelId)
            ->where('shiksah_lavel_completed.exam_id', $examID)
            ->where('shiksah_lavel_completed.is_qualified', '=', 1)
            ->select('shiksah_lavel_completed.certificate_number')
            ->orderBy('shiksah_lavel_completed.certificate_number', 'desc')
            ->first();
        // numeric sequence. If none found, start from 0.
        $lastNumber = 0;
        if ($lastRecord && !empty($lastRecord->certificate_number)) {
            if (preg_match('/(\d+)$/', $lastRecord->certificate_number, $m)) {
                $lastNumber = intval($m[1]);
            }
        }
        $nextNumber = $lastNumber + 1;
        $formattedUserCount = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        $fileName = "ISKDwk" . "/" . $this->getSessionName($sessionID) . "/" . $this->getLevelName($levelId) . $formattedUserCount;
        return $fileName;
    }

    public function getLevelName($levelId)
    {
        $levelName = "";
        switch ($levelId) {
            case "2":
                $levelName = "Sdwn";
                break;
            case "3":
                $levelName = "KSwk";
                break;
            case "4":
                $levelName = "KSdk";
                break;
            case "5":
                $levelName = "SPA";
                break;
            case "7":
                $levelName = "SGCA";
                break;
        }
        return $levelName;
    }
    public function getSessionName($sessionID)
    {
        $sessionName = ExamSessionModel::where('exam_session.id', '=', $sessionID)
            ->select('exam_session.session_name')
            ->first();
        return $sessionName->session_name ?? '';
    }
    public function UploadOfflineMarksExamResult($file, $selectedShikshaLevelId, $selectedExamId)
    {
        try {
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray(null, true, true, true);
            $errors = [];
            $rowNumber = 1;
            $successCount = 0;
            $mismatchFound = false;

            foreach ($data as $index => $row) {
                // Skip header row
                if ($index === 1)
                    continue;
                $rowNumber++;

                $rowErrors = [];

                $loginId = $row['A'];
                $user = User::where('login_id', $loginId)->first();
                if (!$user) {
                    $rowErrors[] = "Row {$rowNumber}: Login ID '{$loginId}' not found";
                }

                $shikshaLevelId = $row['B'];
                $shikshaLevel = ShikshaLevel::where('id', $shikshaLevelId)->first();
                if (!$shikshaLevel) {
                    $rowErrors[] = "Row {$rowNumber}: Shiksha Level ID '{$shikshaLevelId}' not found";
                }

                $examId = $row['C'];
                $exam = Examination::where('id', $examId)->first();
                if (!$exam) {
                    $rowErrors[] = "Row {$rowNumber}: Exam ID '{$examId}' not found";
                }

                if ($examId != $selectedExamId) {
                    $rowErrors[] = "Row {$rowNumber}: Exam ID in file ('{$examId}') does not match selected Exam ID ('{$selectedExamId}')";
                    $mismatchFound = true;
                }


                if ($shikshaLevelId != $selectedShikshaLevelId) {
                    $rowErrors[] = "Row {$rowNumber}: Shiksha Level ID in file ('{$shikshaLevelId}') does not match selected Shiksha Level ID ('{$selectedShikshaLevelId}')";
                    $mismatchFound = true;
                }

                if (!empty($rowErrors)) {
                    $errors = array_merge($errors, $rowErrors);
                    continue;
                }


                $isQualifiedInput = strtoupper(trim($row['H']));
                $isQualified = ($isQualifiedInput === 'TRUE') ? '1' : '0';


                $isPromotedInput = strtoupper(trim($row['I'] ?? 'FALSE'));
                $isPromoted = ($isPromotedInput === 'TRUE') ? '1' : '0';

                $rowTotalMarks = (float) ($row['F'] ?? 0);
                $rowObtainedMarks = (float) ($row['G'] ?? 0);
                $qualifyingMarks = (float) ($exam->qualifying_marks ?? 0);
                $examTotalMarks = (float) ($exam->total_marks ?? 0);

                if ($rowTotalMarks !== $examTotalMarks) {
                    $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Column F total marks '{$row['F']}' does not match exam total marks '{$exam->total_marks}'.";
                }

                if ($isQualified === '1' && $rowObtainedMarks < $qualifyingMarks) {
                    $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}') record is not valid: Column H is TRUE but obtained marks '{$row['G']}' are below qualifying marks '{$exam->qualifying_marks}'. Please check qualified marks.";
                }

                if ($isQualified === '0' && $rowObtainedMarks >= $qualifyingMarks) {
                    $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}') record is not valid: Column H is FALSE but obtained marks '{$row['G']}' meet/exceed qualifying marks '{$exam->qualifying_marks}'. Please check qualified marks.";
                }

                if (!empty($rowErrors)) {
                    $errors = array_merge($errors, $rowErrors);
                    continue;
                }

                $existingRecord = DB::table('shiksah_lavel_completed')
                    ->where('login_id', $loginId)
                    ->where('exam_id', $examId)
                    ->where('shiksha_level', $shikshaLevelId)
                    ->first();

                if ($existingRecord) {
                    $errors[] = "Row {$rowNumber}: Duplicate entry for Login ID '{$loginId}', Shiksha Level '{$shikshaLevelId}', and Exam ID '{$examId}'.";
                    continue;
                }

                if ($mismatchFound) {
                    continue;
                }

                $recordData = [
                    'login_id' => $loginId,
                    'shiksha_level' => $shikshaLevelId,
                    'exam_date' => $row['D'],
                    'total_questions' => $row['E'],
                    'total_marks' => $row['F'],
                    'total_obtain' => $row['G'],
                    'is_qualified' => $isQualified,
                    'is_promoted_by_ashray_leader' => $isPromoted,
                    'ashray_leader_code' => UserAssignAshrayLeader::where('user_id', $user->id)->value('ashray_leader_code'),
                    'exam_id' => $examId,
                    'certificate_number' =>$this->getCertificate($shikshaLevelId, $exam->exam_session, $examId),
                    'certificate_issued' => $isQualified == '1' ? '1' : '0',
                    'created_at' => now(),
                    'updated_at' => now()
                ];

                DB::table('shiksah_lavel_completed')->insert($recordData);
                $successCount++;
            }

            if (!empty($errors)) {
                throw new \Exception(implode("\n", $errors));
            }

            return [
                'success' => true,
                'message' => 'Successfully uploaded ' . $successCount . ' exam results.'
            ];
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getCertificate($LevelId, $sessionId, $examId)
    {
        $fileName = "";
        $lastRecord = ExamLavelCompleted::join('examinations', 'examinations.id', '=', 'shiksah_lavel_completed.exam_id')
            ->where('examinations.exam_session', $sessionId)
            ->where('examinations.exam_level', $LevelId)
            ->where('shiksah_lavel_completed.exam_id', $examId)
            ->where('shiksah_lavel_completed.is_qualified', '=', 1)
            ->select('shiksah_lavel_completed.certificate_number')
            ->orderBy('shiksah_lavel_completed.certificate_number', 'desc')
            ->first();
        // numeric sequence. If none found, start from 0.
        $lastNumber = 0;
        if ($lastRecord && !empty($lastRecord->certificate_number)) {
            if (preg_match('/(\d+)$/', $lastRecord->certificate_number, $m)) {
                $lastNumber = intval($m[1]);
            }
        }
        $nextNumber = $lastNumber + 1;
        $formattedUserCount = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        $fileName = "ISKDwk" . "/" . $this->getSessionName($sessionId) . "/" . $this->getLevelName($LevelId) . $formattedUserCount;
        return $fileName;
    }

    public function ShikshaLevel()
    {
        $requiredLevels = ['Intractive', 'Assignment Submission-GPA', 'Ashray Leader Assesment'];

        return ShikshaLevel::where('is_active', 'Y')
           // ->whereIn('exam_level', $requiredLevels)
            ->get()
            ->toArray();
    }

    public function Examination()
    {
        return Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
            //->where('examinations.is_active', 'Y')
            ->select(
                'examinations.*',
                'exam_session.session_name as exam_session_name',
                'shiksha_levels.exam_level as shiksha_level_name'
            )
            ->get()
            ->toArray();
    }
}
