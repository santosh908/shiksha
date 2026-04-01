<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAssignAshrayLeader extends Model
{
    use HasFactory;

    protected $table = 'user_have_ashray_leader';

    // Define fillable fields to allow mass assignment
    protected $fillable = [
        'user_id',
        'ashray_leader_code',
        'Bhakti_Bhekshuk'
    ];

    // Define the relationships to other models

    // Relationship to User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
