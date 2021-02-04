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
        $user = self::updateOrCreate(
            ["id" => $user->getId()],
            [
                "username" => $user->getUsername(),
                "first_name" => $user->getFirstName(),
                "last_name" => $user->getLastName(),
                "updated_at" => Carbon::now(),
            ]
        );

        return $user;
    }

    public static function getUser($user_id)
    {
        $user = self::find($user_id);

        return $user;
    }

    public static function getUsersWithEnabledPosts()
    {
        $user = self::with([
            "telegram_posts" => function ($query) {
                $query->where("status", 1)->orderBy("post", "asc");
            },
        ])
            ->orderBy("updated_at", "asc")
            ->get();

        return $user;
    }

    public static function deletePhone($user_id)
    {
        $user = self::find($user_id);

        $user->phone = null;

        $user->save();
    }

    public static function updatePhone($user_id, $phone)
    {
        $user = self::find($user_id);

        $user->phone = $phone;

        $user->save();
    }
}
