<?php

namespace App\Models\QuestionBank;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    use HasFactory;
    protected $table = 'questionbank';

    protected $fillable = [
        'question_english',
        'question_hindi',
        'subject',
        'level',
        'chapter',
        'difficulty_label',
        'option1',
        'option2',
        'option3',
        'option4',
        'correctanswer',
        'any_remark',
        'is_active',
    ];

}
