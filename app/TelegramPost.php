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
    protected $fillable = ["id", "telegram_user_id", "status", "post"];

    public function telegram_users()
    {
        return $this->belongsTo("App\User");
    }

    public static function countPost($user_id, $status = null)
    {
        $post_count = self::where("telegram_user_id", $user_id);

        if (!is_null($status)) {
            $post_count->where("status", $status);
        }

        return $post_count->count();
    }

    public static function getPosts($user_id, $status = null)
    {
        $posts = self::where("telegram_user_id", $user_id);

        if (!is_null($status)) {
            $posts->where("status", $status);
        }

        return $posts->get();
    }

    public static function createPost($user_id, $post)
    {
        $post = self::create([
            "telegram_user_id" => $user_id,
            "status" => 1,
            "post" => $post,
        ]);
    }
}
