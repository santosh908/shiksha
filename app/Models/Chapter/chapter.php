<?php

namespace App\Models\Chapter;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class chapter extends Model
{
    use HasFactory;
    protected $table = 'chapters';

    protected $fillable = [
        'subject_id',
        'chapter_name',
        'is_active',
    ];
}
