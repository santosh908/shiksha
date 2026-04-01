<?php

namespace App\Services\Examination;

use App\Models\Examination\Examination;
use App\Models\Examination\ExamSessionModel;
use App\Models\Examination\SubmitedExam;
use App\Models\FinalSubmited;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ShikshaLevel;
use App\Models\ExamLavelCompleted;
use App\Models\ShiksahLavelCompleted;
use App\Services\DevoteeResultList\DevoteeResultListServices;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\select;

class ExaminationService
{

  protected $resultServices;

  public function __construct()
  {
    $this->resultServices = new DevoteeResultListServices();
  }

  public function getExamSessionList()
  {
    return ExamSessionModel::All()->toArray();
  }

  public function getExamSessionWithExamName()
  {
    return Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->leftJoin('exam_question', 'exam_question.exam_id', '=', 'examinations.id')
      ->leftJoin('questionbank as qb', 'exam_question.question_id', '=', 'qb.id') // Alias for questionbank
      ->selectRaw(
        "examinations.id, 
         CONCAT(exam_session.session_name, ' ( ', shiksha_levels.exam_level, ' )') as exam_name, 
         examinations.no_of_question"
      )
      ->with([
        'examQuestions' => function ($query) {
          $query->join('questionbank as qb', 'exam_question.question_id', '=', 'qb.id') // Alias for questionbank
            ->select(
              'exam_question.exam_id',
              'qb.id as question_id',
              'qb.question_english',
              'qb.question_hindi',
              'qb.option1',
              'qb.option2',
              'qb.option3',
              'qb.option4'
            ); // Alias fields
        }
      ])
      ->groupBy('examinations.id', 'exam_session.session_name', 'shiksha_levels.exam_level', 'examinations.no_of_question')
      ->get()
      ->map(function ($item) {
        $item->questions = $item->examQuestions->map(function ($question) {
          return [
            'id' => $question->question_id,
            'question_engligh' => $question->question_english,
            'question_hindi' => $question->question_hindi,
            'option1' => $question->option1,
            'option2' => $question->option2,
            'option3' => $question->option3,
            'option4' => $question->option4,
          ];
        });
        unset($item->examQuestions);
        return $item;
      })
      ->toArray();
  }

  public function getExamSessionWithExamNameByFilter($request)
  {
    return Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->leftJoin('exam_question', 'exam_question.exam_id', '=', 'examinations.id')
      ->leftJoin('questionbank as qb', 'exam_question.question_id', '=', 'qb.id') // Alias for questionbank
      ->selectRaw("
        examinations.id, 
        shiksha_levels.id as ShikshaLevel, 
        CONCAT(exam_session.session_name, ' ( ', shiksha_levels.exam_level, ' )') as exam_name, 
        examinations.no_of_question
    ")
      ->with([
        'examQuestions' => function ($query) {
          $query->join('questionbank as qb', 'exam_question.question_id', '=', 'qb.id') // Alias for questionbank
            ->select(
              'exam_question.exam_id',
              'qb.id as question_id',
              'qb.question_english',
              'qb.question_hindi',
              'qb.option1',
              'qb.option2',
              'qb.option3',
              'qb.option4'
            ); // Alias fields
        }
      ])
      ->groupBy('examinations.id', 'exam_session.session_name', 'shiksha_levels.exam_level', 'shiksha_levels.id', 'examinations.no_of_question')
      ->when($request->input('exam_id'), function ($query) use ($request) {
        return $query->where('examinations.id', $request->input('exam_id'));
      })
      ->get()
      ->map(function ($item) {
        $item->questions = $item->examQuestions->map(function ($question) {
          return [
            'id' => $question->question_id,
            'question_english' => $question->question_english,
            'question_hindi' => $question->question_hindi,
            'option1' => $question->option1,
            'option2' => $question->option2,
            'option3' => $question->option3,
            'option4' => $question->option4,
          ];
        });
        unset($item->examQuestions);
        return $item;
      })
      ->toArray();
  }

  public function createExamSession($request): ExamSessionModel
  {
    return ExamSessionModel::Create(
      [
        'session_name' => $request['session_name'],
        'session_description' => $request['session_description'],
        'session_start_date' => $request['session_start_date'],
      ]
    );
  }

  public function updateExamSession($request)
  {
    $examSesison = ExamSessionModel::where('id', $request->id)->first();
    $examSesison->session_name = $request['session_name'];
    $examSesison->session_description = $request['session_description'];
    $examSesison->session_start_date = $request['session_start_date'];
    $examSesison->save();
    return $examSesison;
  }

  public function deleteExamSession($id)
  {
    $examSession = ExamSessionModel::find($id);
    return $examSession->delete();
  }

  public function createExamination($request): Examination
  {
    return Examination::Create(
      [
        'exam_session' => $request['exam_session_id'],
        'exam_level' => $request['exam_level_id'],
        'remarks' => $request['remarks'],
        'date' => $request['date'],
        'start_time' => $request['start_time'],
        'duration' => $request['duration'],
        'no_of_question' => $request['no_of_question'],
        'total_marks' => $request['total_marks'],
        'qualifying_marks' => $request['qualifying_marks'],
        'is_active' => $request['is_active'],
      ]
    );
  }

  public function ExaminationList()
  {
    $examData = Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->leftJoin('exam_question', 'exam_question.exam_id', '=', 'examinations.id')
      ->leftJoin('questionbank', 'questionbank.id', '=', 'exam_question.question_id')
      ->whereIn('examinations.is_active', ['Y', 'N'])
      ->select(
        'examinations.id as exam_id',
        'examinations.id',
        'exam_session.id as exam_session_id',
        'shiksha_levels.id as exam_level_id',
        'examinations.exam_level',
        'examinations.date',
        'examinations.start_time',
        'examinations.duration',
        'examinations.no_of_question',
        'examinations.total_marks',
        'examinations.qualifying_marks',
        'examinations.is_active',
        'exam_session.session_name',
        'shiksha_levels.exam_level',
        'exam_question.id as exam_question_id',
        'exam_question.question_id',
        'questionbank.question_english',
        'questionbank.question_hindi',
        'questionbank.option1',
        'questionbank.option2',
        'questionbank.option3',
        'questionbank.option4',
        'questionbank.correctanswer',
        'questionbank.any_remark'
      )
      ->orderBy('exam_session.id', 'desc')
      ->orderBy('examinations.exam_level', 'desc')
      ->orderBy('examinations.date', 'desc')
      ->get();

    $Examination = array_values($examData->groupBy('exam_id')->map(function ($questions, $examId) {
      return [
        'id' => $questions->first()->id,
        'exam_id' => $examId,
        'exam_name' => $questions->first()->exam_name,
        'session_name' => $questions->first()->session_name,
        'exam_session_id' => $questions->first()->exam_session_id,
        'exam_level' => $questions->first()->exam_level,
        'exam_level_id' => $questions->first()->exam_level_id,
        'date' => $questions->first()->date,
        'start_time' => $questions->first()->start_time,
        'duration' => $questions->first()->duration,
        'no_of_question' => $questions->first()->no_of_question,
        'total_marks' => $questions->first()->total_marks,
        'qualifying_marks' => $questions->first()->qualifying_marks,
        'is_active' => $questions->first()->is_active,
        'questions' => $questions->map(function ($question) {
          return [
            'question_id' => $question->question_id,
            'question_english' => $question->question_english,
            'question_hindi' => $question->question_hindi,
            'option1' => $question->option1,
            'option2' => $question->option2,
            'option3' => $question->option3,
            'option4' => $question->option4,
            'correctanswer' => $question->correctanswer,
            'any_remark' => $question->any_remark,
          ];
        })->toArray(),
      ];
    })->toArray());

    return $Examination;
  }

  public function updateExamination($request)
  {
    $examination = Examination::where('id', $request->id)->first();

    $examination->exam_session = $request['exam_session_id'];
    $examination->exam_level = $request['exam_level_id'];
    $examination->remarks = $request['remarks'];
    $examination->date = $request['date'];
    $examination->start_time = $request['start_time'];
    $examination->duration = $request['duration'];
    $examination->no_of_question = $request['no_of_question'];
    $examination->total_marks = $request['total_marks'];
    $examination->qualifying_marks = $request['qualifying_marks'];
    $examination->is_active = $request['is_active'];
    $examination->save(); // Save changes to the database

    return $examination;
  }

  public function deleteExamination($id)
  {
    $examination = Examination::find($id);
    return $examination->delete();
  }


  public function DevoteeExamDetailsById($id)
  {
    $examData = Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->leftJoin('final_submited', function ($join) {
        $join->on('final_submited.exam_id', '=', 'examinations.id')
          ->where('final_submited.user_id', '=', Auth::user()->id);
      })
      ->whereIn('examinations.is_active', ['Y', 'N'])
      ->where('examinations.id', '=', $id)
      ->select(
        'examinations.*',
        'exam_session.id as session_id',
        'exam_session.session_name',
        'shiksha_levels.id as exam_level_id',
        'shiksha_levels.exam_level',
        'final_submited.is_submitted'
      )
      ->orderBy('exam_session.id', 'desc')
      ->orderBy('examinations.exam_level', 'desc')
      ->orderBy('examinations.date', 'desc')
      ->get()->toArray();
    return $examData;
  }

  public function ExamDetailsById($id)
  {
    $examData = Examination::join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->whereIn('examinations.is_active', ['Y', 'N'])
      ->where('examinations.id', '=', $id)
      ->select(
        'examinations.*',
        'exam_session.id as session_id',
        'exam_session.session_name',
        'shiksha_levels.id as exam_level_id',
        'shiksha_levels.exam_level',
      )
      ->orderBy('exam_session.id', 'desc')
      ->orderBy('examinations.exam_level', 'desc')
      ->orderBy('examinations.date', 'desc')
      ->get()->toArray();
    return $examData;
  }

  public function SubmitExam($request)
  {
    $finalSubmit = FinalSubmited::updateOrCreate(
      [
        'user_id' => Auth::User()->id,
        'exam_id' => $request->examId,
      ],
      [
        'is_submitted' => 1,
      ]
    );
    return $finalSubmit;
  }


  public function SaveSingleQuestion($request)
  {
    $user = Auth::User();
    $existingRecord = SubmitedExam::where([
      'user_id' => $user->id,
      'exam_id' => $request->examId,
      'session_id' => $request->sessionId,
      'question_id' => $request->questionId,
    ])->first();

    if ($existingRecord) {
      // Update existing record
      $existingRecord->update([
        'selected_answer' => $request->selectedAnswer,
      ]);
      return $existingRecord;
    } else {
      // Create new record
      return SubmitedExam::create([
        'user_id' => $user->id,
        'exam_id' => $request->examId,
        'session_id' => $request->sessionId,
        'question_id' => $request->questionId,
        'selected_answer' => $request->selectedAnswer,
      ]);
    }
  }


  public function getVerifyExamList($shikshaLevel, $session)
  {
    $query = SubmitedExam::select(
      'submited_exam.*',
      'exam_session.session_name',
      'questionbank.question_english',
      'questionbank.question_hindi',
      'questionbank.correctanswer',
      'shiksha_levels.exam_level',
      'questionbank.level',
      'examinations.exam_level',
      'users.login_id',
      'user_have_ashray_leader.ashray_leader_code',
    )
      ->join('exam_session', 'submited_exam.session_id', '=', 'exam_session.id')
      ->join('examinations', 'submited_exam.exam_id', '=', 'examinations.id')
      ->join('questionbank', 'submited_exam.question_id', '=', 'questionbank.id')
      ->join('shiksha_levels', 'examinations.exam_level', '=', 'shiksha_levels.id')
      ->join('users', 'submited_exam.user_id', '=', 'users.id')
      ->join('user_have_ashray_leader', 'submited_exam.user_id', '=', 'user_have_ashray_leader.user_id')
      ->where('shiksha_levels.id', '=', $shikshaLevel)
      ->where('exam_session.id', '=', $session)
      ->whereNotExists(function ($subQuery) {
        $subQuery->select(DB::raw(1))
          ->from('shiksah_lavel_completed')
          ->where('shiksah_lavel_completed.exam_date', '!=', null)
          ->whereColumn('shiksah_lavel_completed.exam_id', 'submited_exam.exam_id');
      });
    return $query->get()->toArray();
  }

  public function getShikshaLevelList()
  {
    $shikshalevel = ShikshaLevel::where('is_active', 'Y')->get()->toArray();
    return $shikshalevel;
  }

  public function getExamListToAllowDevotee()
  {
    $list = Examination::join("exam_session", "exam_session.id", '=', "examinations.exam_session")
      ->join("shiksha_levels", 'shiksha_levels.id', '=', 'examinations.exam_level')
      ->select(
        'examinations.id',
        DB::raw('CONCAT(exam_session.session_name, " - ", shiksha_levels.exam_level) as exam_name')
      )
      ->orderBy('examinations.id', 'desc')
      ->get()
      ->toArray();
    return $list;
  }

  public function getExaminationSessionList()
  {
    $examinationsession = ExamSessionModel::all()->toArray();
    return $examinationsession;
  }

  public function getLoginIdList()
  {
    $loginIds = User::join('professional_information', 'professional_information.user_id', '=', 'users.id')
      ->where('professional_information.status_code', '=', 'A')
      ->pluck('users.login_id')
      ->toArray();
    return $loginIds;
  }

  public function getSessionResultList($examSessionId, $shikshaLevelId, $loginId)
  {
    $completedLevels = DB::table('shiksah_lavel_completed')
      ->join('shiksha_levels', 'shiksha_levels.id', '=', 'shiksah_lavel_completed.shiksha_level')
      ->join('users', 'users.login_id', '=', 'shiksah_lavel_completed.login_id')
      ->join('user_have_ashray_leader', 'user_have_ashray_leader.user_id', '=', 'users.id')
      ->join('ashery_leader', 'ashery_leader.code', '=', 'user_have_ashray_leader.ashray_leader_code')
      ->join('examinations', 'examinations.id', '=', 'shiksah_lavel_completed.exam_id') // Added join with examinations
      ->join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
      ->select([
        'shiksah_lavel_completed.*',
        'shiksha_levels.exam_level',
        'ashery_leader.ashery_leader_name',
        'users.name',
        'users.Initiated_name',
        'users.email',
        'users.contact_number',
        'examinations.qualifying_marks',
        'exam_session.session_name',
      ])
      ->where('shiksha_levels.id', '=', $shikshaLevelId)
      ->where('users.login_id', '=', $loginId)
      ->get()
      ->toArray();

    if (!$completedLevels) {
      $completedLevels = User::join('user_have_ashray_leader', 'user_have_ashray_leader.user_id', '=', 'users.id')
        ->join('ashery_leader', 'ashery_leader.code', '=', 'user_have_ashray_leader.ashray_leader_code')
        ->join('examinations', function ($join) use ($examSessionId, $shikshaLevelId) {
          $join->on('examinations.exam_session', '=', DB::raw($examSessionId))
            ->where('examinations.exam_level', '=', $shikshaLevelId);
        })
        ->join('exam_session', 'exam_session.id', '=', 'examinations.exam_session')
        ->select([
          'ashery_leader.ashery_leader_name',
          'users.*',
          'users.Initiated_name',
          'examinations.exam_level',
          'examinations.qualifying_marks',
          'examinations.total_marks',
          'examinations.id as exam_id',
          'examinations.no_of_question as total_questions',
          'exam_session.session_name',
          'examinations.date as exam_date',
          DB::raw('0 as total_obtain'),
          DB::raw('0 as is_qualified'),
          DB::raw('0 as certificate_issued'),
          DB::raw('"" as certificate_number'),
        ])
        ->where('users.login_id', '=', $loginId)
        ->where('exam_session.id', '=', $examSessionId)
        ->get()
        ->toArray();
    }
    return $completedLevels;
  }

  public function updateMarks($examId, $examLevel, $loginId, $totalObtain)
  {
    // Log::info('updateMarks called', ['exam_id' => $examId, 'exam_level' => $examLevel, 'login_id' => $loginId, 'total_obtain' => $totalObtain]);
    $exam = Examination::where('id', $examId)->first();
    if (!$exam) {
      return [
        'success' => false,
        'message' => 'Examm is not found.'
      ];
    }
    if ($totalObtain > $exam->total_marks) {
      //Log::info('Total obtain should not greater', ['total_marks' => $exam->total_marks, 'qualifying_marks' => $exam->qualifying_marks]);
      return [
        'success' => false,
        'message' => 'Total obtain should not be greater than total marks.'
      ];
    }

    $isQualified = 0;
    $certificateIssue = 0;

    $certificate = ExamLavelCompleted::where('login_id', '=', $loginId)
      ->where('is_qualified', 1)
      ->where('shiksha_level', $examLevel)
      ->where('exam_id', $examId)
      ->select('certificate_number')->first();

    switch ($examLevel) {
      case '2':
      case '3':
      case '4':
      case '5':
        if ($totalObtain >= $exam->qualifying_marks) {
          $isQualified = 1;
          $certificateIssue = 1;
          $certificate = $certificate ? $certificate->certificate_number : $this->resultServices->getCertificateName($examLevel, $exam->exam_session, $exam->id);
        }
        break;
      case '6':
        $examLevel7 = ExamLavelCompleted::where('shiksha_level', 7)
          ->where('login_id', $loginId)->first();
        $level7Obt = $examLevel7 ? intval($examLevel7->total_obtain) : 0;
        if ($level7Obt + intval($totalObtain)) {
          $isQualified = 1;
          $certificateIssue = 1;
          $certificate = $certificate ? $certificate->certificate_number : $this->resultServices->getCertificateName($examLevel, $exam->exam_session, $exam->id);
        }
        break;

      case '7':
        $examLevel6 = ExamLavelCompleted::where('shiksha_level', 6)
          ->where('login_id', $loginId)->first();
        $level6Obt = $examLevel6 ? intval($examLevel6->total_obtain) : 0;
        if ($level6Obt + intval($totalObtain)) {
          $isQualified = 1;
          $certificateIssue = 1;
          $certificate = $certificate ? $certificate->certificate_number : $this->resultServices->getCertificateName($examLevel, $exam->exam_session, 0);
        }
        break;
    }

    // Create or update the completed record for this exam/level/login
    try {
      $complete = ExamLavelCompleted::updateOrCreate(
        [
          'shiksha_level' => $examLevel,
          'login_id' => $loginId,
          'exam_id' => $examId,
        ],
        [
          'exam_date' => $exam->date,
          'total_obtain' => $totalObtain,
          'total_questions' => $exam->no_of_question ?? null,
          'total_marks' => $exam->total_marks ?? null,
          'updated_at' => now(),
          'is_qualified' => $isQualified,
          'certificate_issued' => $certificateIssue,
          'certificate_number' => $certificate,
          'ashray_leader_code' => User::join('user_have_ashray_leader', 'users.id', '=', 'user_have_ashray_leader.user_id')
            ->where('users.login_id', '=', $loginId)
            ->value('user_have_ashray_leader.ashray_leader_code')
        ]
      );
    } catch (\Exception $e) {
      Log::error('Error updating marks: ' . $e->getMessage());
      return [
        'success' => false,
        'message' => 'Error updating marks.' . $e->getMessage()
      ];
    }
    return [
      'success' => true,
      'data' => $complete,
    ];
  }

  public function allowUserToRetakeExam($request): bool
  {
    try {
      $examRecord = FinalSubmited::where('exam_id', $request->exam_id)
        ->where('user_id', $request->user_id)
        ->first();
      if (!$examRecord) {
        // User hasn't taken the exam yet
        return false;
      }
      $examRecord->is_submitted = 0;
      $examRecord->save();
      return true;
    } catch (\Exception $e) {
      // \Log::error('Error allowing exam retake: ' . $e->getMessage());
      return false;
    }
  }
}
