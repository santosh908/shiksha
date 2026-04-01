<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'book';
    protected $fillable = [
        'book_name_english',
        'book_name_hindi',
        'is_active',
    ];
}
