<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegulativePriciple extends Model
{
    use HasFactory;

    
    protected $table = 'regulative_principle';
    protected $fillable = [
        'principle_name_eglish',
        'principle_name_hindi'
    ];
}
