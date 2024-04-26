<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function lastMesaage()
    {
        return $this->belongsTo(Message::class,'last_message_id');
    }

    public function user1()
    {
      return $this->belongsTo(User::class,'user_id1');
    }

    public function user2()
    {
      return $this->belongsTo(User::class,'user_id2');
    }

}
