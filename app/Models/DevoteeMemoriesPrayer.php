<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteeMemoriesPrayer extends Model
{
    use HasFactory;
    protected $table = "devotee_memorised_prayers";

    protected  $fillable = [
        'personal_info_id',
        'prayer_id',
    ];
}
