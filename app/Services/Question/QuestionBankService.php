<?php

namespace App\Services\Question;

use App\Models\Examination\Examination;
use App\Models\QuestionBank\QuestionBank;
use App\Models\QuestionBank\ExamQuestionMoel;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject\Subject;
use App\Models\Chapter\chapter;
use App\Models\ShikshaLevel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class QuestionBankService
{
    public function createQuestionBank($request): QuestionBank
    {
        $correctAnswer = 0;
        switch ($request['correctanswer']) {
            case 'option1':
                $correctAnswer = $request['option1'];
                break;
            case 'option1':
                $correctAnswer = $request['option1'];
                break;
            case 'option2':
                $correctAnswer = $request['option2'];
                break;
            case 'option3':
                $correctAnswer = $request['option3'];
                break;
            case 'option4':
                $correctAnswer = $request['option4'];
                break;
        }
        return QuestionBank::Create(
            [
                'question_english' => $request['question_english'],
                'question_hindi' => $request['question_hindi'],
                'subject' => $request['subject_id'],
                'chapter' => $request['chapter_id'],
                'level' => $request['level_id'],
                'difficulty_label' => $request['difficulty_label'],
                'option1' => $request['option1'],
                'option2' => $request['option2'],
                'option3' => $request['option3'],
                'option4' => $request['option4'],
                'correctanswer' => $correctAnswer,
                'any_remark' => $request['any_remark'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function QuestionBankList(): array
    {
        $QuestionBankList = [
            'QuestionBankList' => QuestionBank::join('subjects', 'subjects.id', '=', 'questionbank.subject')
                ->join('shiksha_levels', 'shiksha_levels.id', '=', 'questionbank.level')
                ->join('chapters', 'chapters.id', '=', 'questionbank.chapter')
                ->select('questionbank.*', 'subjects.subject_name', 'chapters.chapter_name', 'questionbank.subject as subject_id', 'questionbank.chapter as chapter_id', 'shiksha_levels.exam_level', 'questionbank.level as level_id')
                ->get()
                ->toArray(),
        ];
        return $QuestionBankList;
    }

    public function QuestionByExamId($id): array
    {
        $QuestionBankList = [
            QuestionBank::join('exam_question', 'exam_question.question_id', '=', 'questionbank.id')
            ->leftJoin('submited_exam', function ($join) {
                $join->on('submited_exam.exam_id', '=', 'exam_question.exam_id')
                    ->whereColumn('submited_exam.question_id', '=', 'questionbank.id') // Use whereColumn instead of where
                    ->where('submited_exam.user_id', '=', Auth::User()->id);
            })
            ->select('questionbank.*', 'submited_exam.selected_answer')
            ->where('exam_question.exam_id', $id)
            ->get()
            ->toArray(),
        ];
        return $QuestionBankList;
    }

    public function filterQuestions($request)
    {
        if($request->input('exam_id')==null)
        {
            return null;
        }
        // Get the selected question IDs for the given exam
        $selectedQuestionIds = ExamQuestionMoel::where('exam_id', $request->input('exam_id'))
            ->pluck('question_id')
            ->toArray();

        // Fetch filtered questions with optional filters
        $filteredQuestions = QuestionBank::join('subjects', 'subjects.id', '=', 'questionbank.subject')
            ->join('shiksha_levels', 'shiksha_levels.id', '=', 'questionbank.level')
            ->join('chapters', 'chapters.id', '=', 'questionbank.chapter')
            ->where('questionbank.level','=',Examination::where('id', $request->input('exam_id'))->first()?->exam_level)
            ->whereNotIn('questionbank.id', $selectedQuestionIds)  // Exclude already selected questions
            ->select(
                'questionbank.*',
                'subjects.subject_name',
                'questionbank.subject as subject_id',
                'shiksha_levels.exam_level',
                'chapters.chapter_name',
                'questionbank.chapter as chapter_id',
                'questionbank.level as level_id',
            )
            ->when($request->filled('exam_level'), function ($query) use ($request) {
                $query->where('questionbank.level', $request->input('exam_level'));
            })
            ->when($request->filled('subject_level'), function ($query) use ($request) {
                $query->where('questionbank.subject', $request->input('subject_level'));
            })
            ->when($request->filled('chapter_level'), function ($query) use ($request) {
                $query->where('questionbank.chapter', $request->input('chapter_level'));
            })
            ->when($request->filled('difficulty_level'), function ($query) use ($request) {
                $query->where('questionbank.difficulty_label', $request->input('difficulty_level'));
            })
            ->get()->toArray();
        return $filteredQuestions;
    }

    public function getAllQuetion(): array
    {
        return [
            'QuestionBankList' => QuestionBank::join('subjects', 'subjects.id', '=', 'questionbank.subject')
                ->join('shiksha_levels', 'shiksha_levels.id', '=', 'questionbank.level')
                ->select('questionbank.*', 'subjects.subject_name', 'questionbank.subject as subject_id', 'shiksha_levels.exam_level', 'questionbank.level as level_id')
                ->get()
                ->toArray()
        ];
    }

    public function addQuestionsToExams($request)
    {
        // Get question IDs and exam IDs from the request
        $questionIds = (array) $request->input('questionIds'); // Convert to array if not already
        $examIds = (array) $request->input('examId'); // Convert to array if not already

        // Fetch the questions and exams based on the provided IDs
        $questions = QuestionBank::whereIn('id', $questionIds)->get();
        $exams = Examination::whereIn('id', $examIds)->get();

        // Get the logged-in user
        $user = Auth::user();

        // Loop through each question and create an entry in ExamQuestionModel
        foreach ($questions as $question) {
            foreach ($exams as $exam) {
                // Check if the combination of exam_id and question_id already exists
                $existingEntry = ExamQuestionMoel::where('exam_id', $exam->id)
                    ->where('question_id', $question->id)
                    ->exists();

                // If the combination doesn't exist, create the new entry
                if (!$existingEntry) {
                    ExamQuestionMoel::create([
                        'exam_id' => $exam->id,
                        'question_id' => $question->id,
                        'created_by' => $user->id,
                    ]);
                }
            }
        }
        return $questions;
    }

    public function removeQuestion($request)
    {
        $question = ExamQuestionMoel::where([
            ["question_id", '=', $request->query('question_id')],
            ["exam_id", '=', $request->query('exam_id')]
        ])->first();
        return $question->delete();
    }

    public function updateQuestionBank($request)
    {
        $correctAnswer = 0;
        switch ($request['correctanswer']) {
            case 'option1':
                $correctAnswer = $request['option1'];
                break;
            case 'option1':
                $correctAnswer = $request['option1'];
                break;
            case 'option2':
                $correctAnswer = $request['option2'];
                break;
            case 'option3':
                $correctAnswer = $request['option3'];
                break;
            case 'option4':
                $correctAnswer = $request['option4'];
                break;
        }
        $questionbank = QuestionBank::where('id', $request->id)->first();
        $questionbank->question_english = $request['question_english'];
        $questionbank->question_hindi = $request['question_hindi'];
        $questionbank->subject = $request['subject_id'];
        $questionbank->chapter = $request['chapter_id'];
        $questionbank->level = $request['level_id'];
        $questionbank->difficulty_label = $request['difficulty_label'];
        $questionbank->option1 = $request['option1'];
        $questionbank->option2 = $request['option2'];
        $questionbank->option3 = $request['option3'];
        $questionbank->option4 = $request['option4'];
        $questionbank->correctanswer = $correctAnswer;
        $questionbank->any_remark = $request['any_remark'];
        $questionbank->is_active = $request['is_active'];
        $questionbank->save(); // Save changes to the database

        return $questionbank;
    }
    public function ChapterList()
    {
        return chapter::where('is_active', 'Y')->get()->toArray();
    }
    public function SubjectList()
    {
        return subject::where('is_active', 'Y')->get()->toArray();
    }

    public function createBulkQuestionBank($file)
    {
        try {
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray(null, true, true, true);
            $errors = [];
            $rowNumber = 1;
            $successCount = 0;

            foreach ($data as $index => $row) {
                if ($index === 1)
                    continue;
                $rowNumber++;

                $rowErrors = [];


                $subject = Subject::where('id', $row['C'])->first();
                if (!$subject) {
                    $rowErrors[] = "Row {$rowNumber}: Subject ID '{$row['C']}' not found";
                }
                $chapter = chapter::where('id', $row['D'])->first();
                if (!$chapter) {
                    $rowErrors[] = "Row {$rowNumber}: Chapter ID '{$row['D']}' not found";
                }

                $level = ShikshaLevel::where('id', $row['E'])->first();
                if (!$level) {
                    $rowErrors[] = "Row {$rowNumber}: Shiksha Level ID '{$row['E']}' not found";
                }


                if (!empty($rowErrors)) {
                    $errors = array_merge($errors, $rowErrors);
                    continue;
                }

                QuestionBank::create([
                    'question_english' => $row['A'],
                    'question_hindi' => $row['B'],
                    'subject' => $subject->id,
                    'chapter' => $chapter->id,
                    'level' => $level->id,
                    'difficulty_label' => $row['F'],
                    'option1' => $row['G'],
                    'option2' => $row['H'],
                    'option3' => $row['I'],
                    'option4' => $row['J'],
                    'correctanswer' => $row['K'],
                    'any_remark' => $row['L'] ?? null,
                    'is_active' => $row['M']
                ]);
                $successCount++;
            }

            if (!empty($errors)) {
                throw new \Exception(implode("\n", $errors));
            }

            return [
                'success' => true,
                'message' => 'Successfully uploaded ' . $successCount . ' questions.'
            ];
        } catch (\Exception $e) {
            throw $e;
        }
    }

}
