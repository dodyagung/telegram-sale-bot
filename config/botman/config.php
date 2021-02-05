<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Conversation Cache Time
    |--------------------------------------------------------------------------
    |
    | BotMan caches each started conversation. This value defines the
    | number of minutes that a conversation will remain stored in
    | the cache.
    |
    */
    "conversation_cache_time" => 40,

    /*
    |--------------------------------------------------------------------------
    | User Cache Time
    |--------------------------------------------------------------------------
    |
    | BotMan caches user information of the incoming messages.
    | This value defines the number of minutes that this
    | data will remain stored in the cache.
    |
    */
    "user_cache_time" => 30,

    /*
    |--------------------------------------------------------------------------
    | Custom
    |--------------------------------------------------------------------------
    |
    | Custom by telegram-sale-bot
    |
    */
    "command_start" => env("BOT_COMMAND_START"),
    "command_fallback" => env("BOT_COMMAND_FALLBACK"),
    "day_sale" => env("BOT_DAY_SALE"),
    "day_reset" => env("BOT_DAY_RESET"),
];
