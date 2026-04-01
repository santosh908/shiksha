<?php

namespace App\Models\QuestionBank;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestionMoel extends Model
{
    use HasFactory;
    protected $table = 'exam_question';

    protected $fillable =[
        'exam_id',
        'question_id',
        'created_by',
    ];

}
