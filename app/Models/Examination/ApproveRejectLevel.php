<?php

namespace App\Models\Examination;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApproveRejectLevel extends Model
{
    use HasFactory;
    protected $table = 'approval_for_next_level';
    protected $fillable = ['login_id','exam_id', 'shiksha_level', 'IsAllowed'];
}
