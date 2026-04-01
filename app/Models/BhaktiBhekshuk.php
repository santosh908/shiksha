<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class  BhaktiBhekshuk extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional if the table name follows Laravel's naming convention)
    protected $table = 'bhakti_bhekshuk';

    // Define the attributes that are mass assignable
    protected $fillable = [
        'bhakti_bhikshuk_name',
        'ashray_leader_code',
        'user_id',
        'is_active',
    ];

    /**
     * Get the user that owns the AsheryLeader.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
