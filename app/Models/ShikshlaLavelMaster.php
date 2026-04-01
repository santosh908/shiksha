<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShikshlaLavelMaster extends Model
{
    use HasFactory;

    protected $table = 'shiksha__lavel__master';
    protected $fillable = [
        'LavelName',
    ];
}
