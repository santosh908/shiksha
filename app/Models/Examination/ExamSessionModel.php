<?php

namespace App\Models\Examination;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSessionModel extends Model
{
    use HasFactory;
    protected $table = 'exam_session'; 
    protected $fillable = ['session_name','session_description', 'session_start_date'];
}
