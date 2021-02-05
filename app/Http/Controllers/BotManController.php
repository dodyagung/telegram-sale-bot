<?php

namespace App\Http\Controllers;

use App\Conversations\StartConversation;
use App\TelegramPost;
use App\TelegramUser;
use BotMan\BotMan\BotMan;
use BotMan\Drivers\Telegram\TelegramDriver;
use Carbon\Carbon;

class BotManController extends Controller
{
    /**
     * Default landing page.
     */
    public function index()
    {
        return view("welcome");
    }

    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app("botman");

        $botman->listen();
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function tinker()
    {
        return view("tinker");
    }

    /**
     * Loaded through routes/botman.php
     * @param  BotMan $bot
     */
    public function start(BotMan $bot)
    {
        $bot->startConversation(new StartConversation());
    }

    /**
     * Loaded through routes/botman.php
     * @param  BotMan $bot
     */
    public function fallback(BotMan $bot)
    {
        $bot->reply(config("botman.config.command_fallback"));
    }

    /**
     * Place your cron logic here.
     */
    public function cron()
    {
        $now = Carbon::now();
        $bot_day_sale = Carbon::parse(config("botman.config.day_sale"));
        $bot_day_reset = Carbon::parse(config("botman.config.day_reset"));

        $telegram_group_id = config("botman.telegram.group_id");

        if ($bot_day_reset->isToday()) {
            TelegramPost::disablePosts();
        }

        if ($bot_day_sale->isToday()) {
            $users_with_enabled_post = TelegramUser::getUsersWithEnabledPosts();

            $lines = [];

            $lines[0] = "*Today Hot Sale*" . PHP_EOL . PHP_EOL;
            $lines[0] .=
                "It's *" .
                $now->isoFormat("dddd, DD MMMM YYYY - HH:mm z") .
                "*. Want to join the sale? _Chat me!_" .
                PHP_EOL .
                PHP_EOL;

            $active_array = 0;
            foreach ($users_with_enabled_post as $user) {
                $temp =
                    "💰 [" .
                    $user->first_name .
                    ($user->last_name ? " " . $user->last_name : "") .
                    "](tg://user?id=" .
                    $user->id .
                    ")" .
                    ($user->phone ? " (`" . $user->phone . "`)" : "") .
                    PHP_EOL;

                if ($user->telegram_posts->isEmpty()) {
                    continue;
                } else {
                    for ($i = 0; $i < $user->telegram_posts->count(); $i++) {
                        if ($i + 1 == $user->telegram_posts->count()) {
                            $prefix = " └ ";
                        } else {
                            $prefix = " ├ ";
                        }
                        $temp .=
                            $prefix .
                            $user->telegram_posts->get($i)->post .
                            PHP_EOL;
                    }
                }
                $temp .= PHP_EOL;

                if (strlen($lines[$active_array] . $temp) >= 4096) {
                    $active_array++;
                    $lines[$active_array] = "";
                }

                $lines[$active_array] .= $temp;
            }

            $botman = app("botman");
            foreach ($lines as $key => $value) {
                $botman->say(
                    $value,
                    $telegram_group_id,
                    TelegramDriver::class,
                    [
                        "parse_mode" => "Markdown",
                        "disable_notification" => true,
                        "disable_web_page_preview" => true,
                    ]
                );
            }
        }
    }
}
