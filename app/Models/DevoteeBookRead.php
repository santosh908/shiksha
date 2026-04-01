<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteeBookRead extends Model
{
    use HasFactory;
    protected $table = "devotee_book";

    protected  $fillable = [
        'personal_info_id',
        'book_id',
    ];
}
