<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AsheryLeader;

class Interactive_Exam extends Model
{
    use HasFactory;
    protected $table = 'interactive_exams';

    protected $fillable = [
        'login_id',
        'shiksha_level',
        'exam_date',
        'total_question',
        'total_marks',
        'marks_obtain',
        'is_qualified',
        'is_certificate_issued',
        'certificate_path',
        'is_promoted_by_ashray_leader',
        'ashray_leader_id',
    ];

    protected $casts = [
        'exam_date' => 'datetime',
        'is_qualified' => 'boolean',
        'is_certificate_issued' => 'boolean',
        'is_promoted_by_ashray_leader' => 'boolean',
    ];

    // public function ashrayLeader()
    // {
    //     return $this->belongsTo(AsheryLeader::class, 'code');
    // }
}
