<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsheryLeader extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional if the table name follows Laravel's naming convention)
    protected $table = 'ashery_leader';

    // Define the attributes that are mass assignable
    protected $fillable = [
        'ashery_leader_name',
        'code',
        'user_id',
        'is_active',
    ];

    public function bhaktiBhikshuks()
    {
        return $this->hasMany(BhaktiBhekshuk::class, 'ashray_leader_code', 'code');
    }

    /**
     * Get the user that owns the AsheryLeader.
     */
    /**
     * Get the user that owns the AsheryLeader.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
