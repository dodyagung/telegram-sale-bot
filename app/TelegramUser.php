<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TelegramUser extends Model
{
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        "id",
        "username",
        "first_name",
        "last_name",
        "phone",
        "updated_at",
    ];

    public function telegramPosts()
    {
        return $this->hasMany("App\TelegramPost");
    }
}
