<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalSubmited extends Model
{
    use HasFactory;

    protected $table = 'final_submited';

    protected $fillable = [
        'user_id',
        'exam_id',
        'is_submitted',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
