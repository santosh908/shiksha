<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteePrinciples extends Model
{
    use HasFactory;
    protected $table = "devotee_principles";

    protected  $fillable = [
        'personal_info_id',
        'principle_id',
    ];
}
