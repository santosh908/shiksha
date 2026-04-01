<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeritalStatus extends Model
{
    use HasFactory;
    protected $table = 'merital_status';
    protected $fillable = [
        'merital_status_name',
        'is_active',
    ];
}
