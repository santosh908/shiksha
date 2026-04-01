<?php

namespace App\Models\Examination;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionBank\QuestionBank;
use App\Models\QuestionBank\ExamQuestionMoel;

class Examination extends Model
{
    use HasFactory;
    protected $table = 'examinations';
    protected $fillable = ['exam_title','exam_session', 'exam_level', 'remarks', 'date', 'start_time', 'duration', 'no_of_question','total_marks','qualifying_marks', 'is_active'];

    public function examQuestions()
    {
        return $this->hasManyThrough(QuestionBank::class, ExamQuestionMoel::class, 'exam_id', 'id', 'id', 'question_id');
    }
    //change in db
}
