<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShikshaLevel extends Model
{
    use HasFactory;
    protected $table = "shiksha_levels";
    protected $fillable = ['exam_level', 'is_active'];
}
