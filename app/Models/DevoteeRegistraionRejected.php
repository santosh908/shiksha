<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevoteeRegistraionRejected extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'devotee_registration_rejection';

    // Define fillable fields to allow mass assignment
    protected $fillable = [
        'rejected_by',
        'profile_id',
        'remarks',
    ];

    public function profileRejectionRemarks()
    {
        return $this->belongsToMany(ProfessionalInformation::class, 'professional_information', 'profile_id', 'id');
    }

}
