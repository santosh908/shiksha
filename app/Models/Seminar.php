<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seminar extends Model
{
    use HasFactory;

    protected $table = 'seminar';
    protected $fillable = [
        'seminar_name_english',
        'seminar_name_hindi',
        'is_active',
    ];
}
