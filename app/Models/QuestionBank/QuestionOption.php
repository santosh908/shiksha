<?php

namespace App\Models\QuestionBank;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    use HasFactory;

    protected $table = 'question_option_table';

    protected $fillable = [
        'question_id',
        'option_sequence',
        'option',
        'is_answer',
        'answer_explanation',
        'is_active'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
