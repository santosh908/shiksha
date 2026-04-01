<?php

namespace App\Models\RaiseQuery;
use app\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RaiseQuery extends Model
{
    use HasFactory;
    protected $table = 'raise_queries';
    protected $fillable = ['subject', 'description', 'from_id', 'to_id', 'query_id', 'is_viewed'];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_id', 'login_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id', 'login_id');
    }

}
