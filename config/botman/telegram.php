<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Telegram Token
    |--------------------------------------------------------------------------
    |
    | Your Telegram bot token you received after creating
    | the chatbot through Telegram.
    |
    */
    "token" => env("TELEGRAM_TOKEN"),

    /*
    |--------------------------------------------------------------------------
    | Custom
    |--------------------------------------------------------------------------
    |
    | Custom by telegram-sale-bot
    |
    */
    "group_id" => env("TELEGRAM_GROUP_ID"),
    "group_name" => env("TELEGRAM_GROUP_NAME"),
    "group_link" => env("TELEGRAM_GROUP_LINK"),
];
