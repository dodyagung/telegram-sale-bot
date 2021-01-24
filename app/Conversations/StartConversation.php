<?php

namespace App\Conversations;

use Illuminate\Foundation\Inspiring;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;

class StartConversation extends Conversation
{
    /**
     * Start the conversation
     */
    public function run()
    {
        $this->askStart();
    }

    public function fallback(Answer $answer)
    {
        if ($answer->getText() == env("BOT_COMMAND_START")) {
            $this->bot->startConversation(new StartConversation());
        } else {
            $this->say(env("BOT_COMMAND_FALLBACK"));
        }
    }

    /**
     * Place your conversation logic here.
     */
    public function askStart()
    {
        $question = Question::create(
            "Huh, you woke me up. I'm your telegram-sale-bot. What do you need?"
        )
            ->fallback("Unable to ask start")
            ->callbackId("ask_start")
            ->addButtons([
                Button::create("Joke")->value("joke"),
                Button::create("Quote")->value("quote"),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                if ($answer->getValue() === "joke") {
                    $joke = json_decode(
                        file_get_contents("http://api.icndb.com/jokes/random")
                    );
                    $this->say($joke->value->joke);
                } else {
                    $this->say(Inspiring::quote());
                }
            } else {
                $this->fallback($answer);
            }
        });
    }
}
