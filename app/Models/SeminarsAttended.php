<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeminarsAttended extends Model
{
    use HasFactory;
    protected $table = "seminars_attended";

    protected  $fillable = [
        'id',
        'user_id',
        'seminar_id',
    ];

}
