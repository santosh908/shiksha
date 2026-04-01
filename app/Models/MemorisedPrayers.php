<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemorisedPrayers extends Model
{
    use HasFactory;

    protected $table = 'prayer';
    protected $fillable = [
        'prayer_name_english',
        'prayer_name_hindi',
        'is_active',
    ];

}
