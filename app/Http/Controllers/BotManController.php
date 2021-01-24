<?php

namespace App\Http\Controllers;

use BotMan\BotMan\BotMan;
use App\Conversations\StartConversation;

class BotManController extends Controller
{
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
        $bot->reply("Sorry, I did not understand these commands.");
    }
}
