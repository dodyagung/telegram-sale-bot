<?php

namespace App;

use Carbon\Carbon;
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

    public function telegram_posts()
    {
        return $this->hasMany("App\TelegramPost");
    }

    public static function saveUser($user)
    {
        self::updateOrCreate(
            ["id" => $user->getId()],
            [
                "username" => $user->getUsername(),
                "first_name" => $user->getFirstName(),
                "last_name" => $user->getLastName(),
                "updated_at" => Carbon::now(),
            ]
        );
    }
}
