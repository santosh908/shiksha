<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiksahLavelCompleted extends Model
{
    use HasFactory; 
    protected $table = 'ShiksahLavelCompleted';
    protected $fillable = [
        'user_id',
        'Shiksha_lavel',
    ];
}
