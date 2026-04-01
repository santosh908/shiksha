<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteeRegistrationStatus extends Model
{
    use HasFactory;

    protected $table = 'devotee_registration_status';

    protected $fillable = [
        'registration_start_date',
        'registration_end_date',
        'is_open',
    ];

    protected $casts = [
        'registration_start_date' => 'datetime',
        'registration_end_date' => 'datetime',
    ];

    /**
     * Get the current registration status
     */
    public static function getCurrentStatus()
    {
        return self::latest()->first();
    }

    /**
     * Check if registration is currently open
     */
    public function isRegistrationOpen(): bool
    {
        return $this->is_open === 'Open';
    }

    /**
     * Check if registration is within date range
     */
    public function isWithinDateRange(): bool
    {
        $now = now()->startOfDay();
        return $now->greaterThanOrEqualTo($this->registration_start_date) 
            && $now->lessThanOrEqualTo($this->registration_end_date);
    }
}
