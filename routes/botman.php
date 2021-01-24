<?php

use App\Http\Controllers\BotManController;

$botman = resolve("botman");

$botman->hears(env("BOT_COMMAND_START"), BotManController::class . "@start");

$botman->fallback(BotManController::class . "@fallback");
