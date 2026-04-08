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
        $spreadsheet = IOFactory::load($file->getPathname());
        $worksheet = $spreadsheet->getActiveSheet();
        $data = $worksheet->toArray(null, true, true, true);

        $selectedExam = Examination::find($selectedExamId);
        $selectedLevel = ShikshaLevel::find($selectedShikshaLevelId);
        if (!$selectedExam || !$selectedLevel) {
            throw new \Exception('Selected exam or shiksha level is invalid.');
        }

        $isWrittenLevelUpload = (string) $selectedShikshaLevelId === '7';
        $assignmentMarksByLoginId = [];
        if ($isWrittenLevelUpload) {
            $levelSixExamIds = Examination::query()
                ->where('exam_session', $selectedExam->exam_session)
                ->where('exam_level', 6)
                ->pluck('id')
                ->all();

            if (empty($levelSixExamIds)) {
                throw new \Exception('Please upload assignment marks before uploading written marks.');
            }

            $assignmentRows = DB::table('shiksah_lavel_completed')
                ->select('login_id', DB::raw('MAX(total_obtain) as assignment_obtain'))
                ->whereIn('exam_id', $levelSixExamIds)
                ->where('shiksha_level', 6)
                ->groupBy('login_id')
                ->get();

            if ($assignmentRows->isEmpty()) {
                throw new \Exception('Please upload assignment marks before uploading written marks.');
            }

            foreach ($assignmentRows as $assignmentRow) {
                $assignmentMarksByLoginId[$assignmentRow->login_id] = (float) $assignmentRow->assignment_obtain;
            }
        }

        $parsedRows = [];
        $loginIds = [];
        foreach ($data as $index => $row) {
            if ($index === 1) {
                continue;
            }

            $loginId = trim((string) ($row['A'] ?? ''));
            $parsedRows[] = [
                'row_number' => $index,
                'login_id' => $loginId,
                'shiksha_level_id' => trim((string) ($row['B'] ?? '')),
                'exam_id' => trim((string) ($row['C'] ?? '')),
                'exam_date' => $row['D'] ?? null,
                'total_questions' => $row['E'] ?? null,
                'total_marks' => $row['F'] ?? null,
                'total_obtain' => $row['G'] ?? null,
                'is_qualified_raw' => strtoupper(trim((string) ($row['H'] ?? ''))),
                'is_promoted_raw' => strtoupper(trim((string) ($row['I'] ?? 'FALSE'))),
            ];
            if ($loginId !== '') {
                $loginIds[] = $loginId;
            }
        }

        $loginIds = array_values(array_unique($loginIds));
        $users = User::whereIn('login_id', $loginIds)->get()->keyBy('login_id');
        $leaderCodesByUserId = UserAssignAshrayLeader::whereIn('user_id', $users->pluck('id')->all())
            ->pluck('ashray_leader_code', 'user_id');

        $existingRecords = DB::table('shiksah_lavel_completed')
            ->where('exam_id', $selectedExamId)
            ->where('shiksha_level', $selectedShikshaLevelId)
            ->whereIn('login_id', $loginIds)
            ->pluck('login_id')
            ->all();
        $existingLoginIds = array_flip($existingRecords);

        $failedItems = [];
        $insertRows = [];
        $alreadyQueuedLoginIds = [];
        $successCount = 0;

        foreach ($parsedRows as $row) {
            $rowErrors = [];
            $rowNumber = $row['row_number'];
            $loginId = $row['login_id'];
            $examId = $row['exam_id'];
            $shikshaLevelId = $row['shiksha_level_id'];

            if ($loginId === '') {
                $rowErrors[] = "Row {$rowNumber}: Login ID is required.";
            } elseif (!$users->has($loginId)) {
                $rowErrors[] = "Row {$rowNumber}: Login ID '{$loginId}' not found.";
            }

            if ((string) $shikshaLevelId !== (string) $selectedShikshaLevelId) {
                $rowErrors[] = "Row {$rowNumber}: Shiksha Level ID in file ('{$shikshaLevelId}') does not match selected Shiksha Level ID ('{$selectedShikshaLevelId}').";
            }

            if ((string) $examId !== (string) $selectedExamId) {
                $rowErrors[] = "Row {$rowNumber}: Exam ID in file ('{$examId}') does not match selected Exam ID ('{$selectedExamId}').";
            }

            $isQualifiedRaw = preg_replace('/\s+/u', '', (string) $row['is_qualified_raw']);
            $isQualifiedRaw = ltrim(strtoupper($isQualifiedRaw), '=');
            $isQualifiedNormalized = match ($isQualifiedRaw) {
                'T', 'TRUE', '1', 'Y', 'YES' => 'TRUE',
                'F', 'FALSE', '0', 'N', 'NO', '' => 'FALSE',
                default => null,
            };
            if ($isQualifiedNormalized === null) {
                $isQualifiedNormalized = match ((string) $row['is_qualified_raw']) {
                    '1', '1.0' => 'TRUE',
                    '0', '0.0' => 'FALSE',
                    default => null,
                };
            }
            if ($isQualifiedNormalized === null) {
                $isQualifiedNormalized = match (trim((string) $row['is_qualified_raw'])) {
                    '1', '1.0' => 'TRUE',
                    '0', '0.0' => 'FALSE',
                    default => null,
                };
            }
            if ($isQualifiedNormalized === null) {
                $isQualifiedNormalized = match ((string) $row['is_qualified_raw']) {
                    'true', 'TRUE' => 'TRUE',
                    'false', 'FALSE' => 'FALSE',
                    default => null,
                };
            }
            if ($isQualifiedNormalized === null) {
                $isQualifiedNormalized = match ((string) ($row['H'] ?? '')) {
                'TRUE', '1', 'Y', 'YES' => 'TRUE',
                'FALSE', '0', 'N', 'NO', '' => 'FALSE',
                default => null,
                };
            }
            if ($isQualifiedNormalized === null) {
                $rowErrors[] = "Row {$rowNumber}: Column H (is_qualified) must be TRUE or FALSE.";
            }

            $isPromotedRaw = preg_replace('/\s+/u', '', (string) $row['is_promoted_raw']);
            $isPromotedRaw = ltrim(strtoupper($isPromotedRaw), '=');
            $isPromotedNormalized = match ($isPromotedRaw) {
                'T', 'TRUE', '1', 'Y', 'YES' => 'TRUE',
                'F', 'FALSE', '0', 'N', 'NO', '' => 'FALSE',
                default => null,
            };
            if ($isPromotedNormalized === null) {
                // Be tolerant for Excel formatting variants; treat unknown as FALSE.
                $isPromotedNormalized = 'FALSE';
            }

            $rowTotalMarks = is_numeric($row['total_marks']) ? (float) $row['total_marks'] : null;
            $rowObtainedMarks = is_numeric($row['total_obtain']) ? (float) $row['total_obtain'] : null;
            if ($rowTotalMarks === null) {
                $rowErrors[] = "Row {$rowNumber}: Column F (total_marks) must be numeric.";
            }
            if ($rowObtainedMarks === null) {
                $rowErrors[] = "Row {$rowNumber}: Column G (obtained_marks) must be numeric.";
            }

            $qualifyingMarks = (float) ($selectedExam->qualifying_marks ?? 0);
            $examTotalMarks = (float) ($selectedExam->total_marks ?? 0);
            if ($rowTotalMarks !== null && $rowTotalMarks !== $examTotalMarks) {
                $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Column F total marks '{$row['total_marks']}' does not match exam total marks '{$selectedExam->total_marks}'.";
            }

            $computedIsQualified = null;
            if ($rowObtainedMarks !== null && $isQualifiedNormalized !== null) {
                if ($isWrittenLevelUpload) {
                    if (!isset($assignmentMarksByLoginId[$loginId])) {
                        $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Please upload assignment marks before uploading written marks.";
                    } else {
                        $assignmentObtain = (float) $assignmentMarksByLoginId[$loginId];
                        $combinedMarks = $assignmentObtain + $rowObtainedMarks;
                        $computedIsQualified = $combinedMarks > 98 ? '1' : '0';
                        $excelQualified = $isQualifiedNormalized === 'TRUE' ? '1' : '0';
                        if ($computedIsQualified !== $excelQualified) {
                            $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Column H does not match qualification rule. Assignment ({$assignmentObtain}) + Written ({$rowObtainedMarks}) = {$combinedMarks}; expected H = " . ($computedIsQualified === '1' ? 'TRUE' : 'FALSE') . '.';
                        }
                    }
                } else {
                    $computedIsQualified = $rowObtainedMarks >= $qualifyingMarks ? '1' : '0';
                    $excelQualified = $isQualifiedNormalized === 'TRUE' ? '1' : '0';
                    if ($computedIsQualified !== $excelQualified) {
                        if ($excelQualified === '1') {
                            $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Column H is TRUE but obtained marks '{$row['total_obtain']}' are below qualifying marks '{$selectedExam->qualifying_marks}'.";
                        } else {
                            $rowErrors[] = "Row {$rowNumber} (Login ID '{$loginId}'): Column H is FALSE but obtained marks '{$row['total_obtain']}' meet/exceed qualifying marks '{$selectedExam->qualifying_marks}'.";
                        }
                    }
                }
            }

            if ($loginId !== '' && isset($existingLoginIds[$loginId])) {
                $rowErrors[] = "Row {$rowNumber}: Duplicate entry for Login ID '{$loginId}', Shiksha Level '{$selectedShikshaLevelId}', and Exam ID '{$selectedExamId}'.";
            }

            if ($loginId !== '' && isset($alreadyQueuedLoginIds[$loginId])) {
                $rowErrors[] = "Row {$rowNumber}: Duplicate Login ID '{$loginId}' found multiple times in uploaded file for selected exam/level.";
            }

            if (!empty($rowErrors)) {
                $failedItem = [
                    'row_number' => $rowNumber,
                    'login_id' => $loginId,
                    'reasons' => $rowErrors,
                ];
                if ($isWrittenLevelUpload) {
                    $assignmentObtain = isset($assignmentMarksByLoginId[$loginId]) ? (float) $assignmentMarksByLoginId[$loginId] : null;
                    $writtenObtain = $rowObtainedMarks;
                    $failedItem['assignment_obtain'] = $assignmentObtain;
                    $failedItem['written_obtain'] = $writtenObtain;
                    $failedItem['combined_obtain'] = ($assignmentObtain !== null && $writtenObtain !== null)
                        ? ($assignmentObtain + $writtenObtain)
                        : null;
                }
                $failedItems[] = $failedItem;
                continue;
            }

            $user = $users->get($loginId);
            $ashrayLeaderCode = $leaderCodesByUserId[$user->id] ?? null;
            if ($ashrayLeaderCode === null) {
                $failedItem = [
                    'row_number' => $rowNumber,
                    'login_id' => $loginId,
                    'reasons' => ["Ashray leader mapping not found for this user."],
                ];
                if ($isWrittenLevelUpload) {
                    $assignmentObtain = isset($assignmentMarksByLoginId[$loginId]) ? (float) $assignmentMarksByLoginId[$loginId] : null;
                    $writtenObtain = $rowObtainedMarks;
                    $failedItem['assignment_obtain'] = $assignmentObtain;
                    $failedItem['written_obtain'] = $writtenObtain;
                    $failedItem['combined_obtain'] = ($assignmentObtain !== null && $writtenObtain !== null)
                        ? ($assignmentObtain + $writtenObtain)
                        : null;
                }
                $failedItems[] = $failedItem;
                continue;
            }

            $isQualified = $computedIsQualified ?? (($isQualifiedNormalized ?? 'FALSE') === 'TRUE' ? '1' : '0');
            $certificateIssued = $isQualified === '1' ? '1' : '0';
            $certificateNumber = $isQualified === '1'
                ? $this->getCertificate((string) $selectedShikshaLevelId, $selectedExam->exam_session, (string) $selectedExamId)
                : null;

            $insertRows[] = [
                'login_id' => $loginId,
                'shiksha_level' => $selectedShikshaLevelId,
                'exam_date' => $row['exam_date'],
                'total_questions' => $row['total_questions'],
                'total_marks' => $row['total_marks'],
                'total_obtain' => $row['total_obtain'],
                'is_qualified' => $isQualified,
                'is_promoted_by_ashray_leader' => ($isPromotedNormalized ?? 'FALSE') === 'TRUE' ? '1' : '0',
                'ashray_leader_code' => $ashrayLeaderCode,
                'exam_id' => $selectedExamId,
                'certificate_number' => $certificateNumber,
                'certificate_issued' => $certificateIssued,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $alreadyQueuedLoginIds[$loginId] = true;
            $successCount++;
        }

        if (!empty($insertRows)) {
            DB::table('shiksah_lavel_completed')->insert($insertRows);
        }

        $failedRows = [];
        $failedLoginIds = [];
        foreach ($failedItems as $item) {
            $failedLoginId = trim((string) ($item['login_id'] ?? ''));
            $rowNo = $item['row_number'];
            $reasons = $item['reasons'] ?? [];
            $reasonText = implode(' | ', $reasons);
            $extraContext = '';
            if ($isWrittenLevelUpload) {
                $assignment = $item['assignment_obtain'] ?? null;
                $written = $item['written_obtain'] ?? null;
                $combined = $item['combined_obtain'] ?? null;
                $assignmentText = $assignment !== null ? (string) $assignment : 'N/A';
                $writtenText = $written !== null ? (string) $written : 'N/A';
                $combinedText = $combined !== null ? (string) $combined : 'N/A';
                $extraContext = " [Assignment={$assignmentText}, Written={$writtenText}, Total={$combinedText}]";
            }
            if ($failedLoginId !== '') {
                $failedRows[] = "Row {$rowNo} (Login ID '{$failedLoginId}'): {$reasonText}{$extraContext}";
                $failedLoginIds[] = $failedLoginId;
            } else {
                $failedRows[] = "Row {$rowNo}: {$reasonText}{$extraContext}";
            }
        }

        $failedLoginIds = array_values(array_unique($failedLoginIds));

        return [
            'success' => $successCount > 0,
            'uploaded_count' => $successCount,
            'failed_count' => count($failedItems),
            'failed_rows' => $failedRows,
            'failed_login_ids' => $failedLoginIds,
            'message' => "Uploaded {$successCount} rows. " . count($failedItems) . ' rows were skipped due to validation.',
        ];
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
