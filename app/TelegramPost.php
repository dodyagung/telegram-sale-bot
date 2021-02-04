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

        $posts->orderBy("post", "asc");

        return $posts->get();
    }

    public static function createPost($user_id, $value)
    {
        $post = self::create([
            "telegram_user_id" => $user_id,
            "status" => 1,
            "post" => $value,
        ]);
    }

    public static function getPost($post_id)
    {
        $post = self::find($post_id);

        return $post;
    }

    public static function toggleStatusPost($post_id)
    {
        $post = self::find($post_id);

        $post->status = !$post->status;

        $post->save();
    }

    public static function editPost($post_id, $value)
    {
        $post = self::find($post_id);

        $post->post = $value;

        $post->save();
    }

    public static function deletePost($post_id)
    {
        self::destroy($post_id);
    }

    public static function disablePosts()
    {
        self::where("status", 1)->update([
            "status" => 0,
        ]);
    }
}
