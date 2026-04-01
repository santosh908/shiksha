<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalInformation extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'professional_information';

    // Define fillable fields to allow mass assignment
    protected $fillable = [
        'user_id',
        'education',
        'marital_status',
        'profession',
        'spiritual_master',
        'join_askcon',
        'current_address',
        'pincode',
        'state_code',
        'district_code',
        'Socity_Name',
        'Sector_Area',
        
    ];

    // Define the relationships to other models

    // Relationship to User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to Education model
    public function education()
    {
        return $this->belongsTo(Education::class, 'education');
    }

    public function devoteeMemorisePrayer()
    {
        return $this->belongsToMany(DevoteeMemoriesPrayer::class, 'devotee_memorised_prayers', 'personal_info_id', 'prayer_id');
    }

    public function devoteeAttendedSeminar()
    {
        return $this->belongsToMany(DevoteeAttendedSeminar::class, 'devotee_attended_seminar', 'personal_info_id', 'seminar_id');
    }

    public function devoteePrinciples()
    {
        return $this->belongsToMany(DevoteePrinciples::class, 'devotee_principles', 'personal_info_id', 'principle_id');
    }

    public function devoteeBookRead()
    {
        return $this->belongsToMany(DevoteeBookRead::class, 'devotee_book', 'personal_info_id', 'book_id');
    }

    // Relationship to MeritalStatus model
    public function maritalStatus()
    {
        return $this->belongsTo(MeritalStatus::class, 'marital_status');
    }

    // Relationship to Profession model
    public function profession()
    {
        return $this->belongsTo(Profession::class, 'profession');
    }

    // Relationship to State model
    public function state()
    {
        return $this->belongsTo(State::class, 'state_code');
    }

    // Relationship to District model
    public function district()
    {
        return $this->belongsTo(District::class, 'district_code');
    }
}
 