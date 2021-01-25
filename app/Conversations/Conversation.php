<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation as BaseConversation;
use BotMan\BotMan\Messages\Incoming\Answer;

class Conversation extends BaseConversation
{
    /**
     * Start the conversation
     */
    public function run()
    {
        $this->askConversation();
    }

    /**
     * Handle the fallback
     */
    public function fallback(Answer $answer)
    {
        if ($answer->getText() == env("BOT_COMMAND_START")) {
            $this->bot->startConversation(new StartConversation());
        } else {
            $this->say(env("BOT_COMMAND_FALLBACK"));
        }
    }
}
