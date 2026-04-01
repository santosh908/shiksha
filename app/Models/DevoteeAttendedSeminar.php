<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteeAttendedSeminar extends Model
{
    use HasFactory;
    protected $table = "devotee_attended_seminar";

    protected  $fillable = [
        'personal_info_id',
        'seminar_id',
    ];
}
