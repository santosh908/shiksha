<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class ExamLavelCompleted extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     * 
     * 
     */
    protected $table = "shiksah_lavel_completed";

    protected $fillable = [
        'login_id',
        'shiksha_level',
        'exam_id',
        'total_questions',
        'total_marks',
        'total_obtain',
        'exam_date',
        'is_qualified',
        'certificate_issued',
        'certificate_number',
    ];
}
