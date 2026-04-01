<?php

namespace App\Models\Subject;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $table = 'subjects';

    protected $fillable = [
        'subject_name',
        'shiksha_level_id',
        'is_active',
    ];
}
