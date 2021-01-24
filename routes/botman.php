<?php

$botman = resolve("botman");

$botman->hears("Hi", function ($bot) {
    $bot->reply("Hello!");
});

$botman->hears("Start conversation", "BotManController@startConversation");
