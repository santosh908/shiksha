<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookRead extends Model
{
    use HasFactory;
    protected $table = "book_read";

    protected  $fillable = [
        'id',
        'user_id',
        'book_id',
    ];
}
