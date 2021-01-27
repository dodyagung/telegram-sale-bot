<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TelegramPost extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ["id", "telegram_user_id", "active", "post"];

    public function telegram_users()
    {
        return $this->belongsTo("App\User");
    }

    public static function countPost($user, $active = null)
    {
        $post_count = self::where("telegram_user_id", $user->getId());

        if (!is_null($active)) {
            $post_count->where("active", $active);
        }

        return $post_count->count();
    }
}
