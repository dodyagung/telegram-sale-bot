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

    public static function countPost($user_id, $active = null)
    {
        $post_count = self::where("telegram_user_id", $user_id);

        if (!is_null($active)) {
            $post_count->where("active", $active);
        }

        return $post_count->count();
    }

    public static function getPosts($user_id, $active = null)
    {
        $posts = self::where("telegram_user_id", $user_id);

        if (!is_null($active)) {
            $posts->where("active", $active);
        }

        return $posts->get();
    }

    public static function createPost($user_id, $post)
    {
        $post = self::create([
            "telegram_user_id" => $user_id,
            "active" => 1,
            "post" => $post,
        ]);
    }
}
