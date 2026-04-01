<?php

namespace App\Models\Examination;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionBank\QuestionBank;
use App\Models\QuestionBank\ExamQuestionMoel;

class SubmitedExam extends Model
{
    use HasFactory;
    protected $table = 'submited_exam';
    protected $fillable = ['user_id','session_id', 'exam_id', 'question_id', 'selected_answer'];
}
