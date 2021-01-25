<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class StartConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $message =
            "Huh, you woke me up. I'm your telegram-sale-bot. What do you need?";

        $question = Question::create($message)->addButtons([
            Button::create("💰 Sale")->value("sale"),
            Button::create("👤 Profile")->value("profile"),
            Button::create("❓ Tutorial")->value("tutorial"),
            Button::create("🤖 About")->value("about"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "sale":
                            $this->bot->startConversation(
                                new AboutConversation()
                            );
                            break;
                        case "profile":
                            $this->bot->startConversation(
                                new ProfileConversation()
                            );
                            break;
                        case "tutorial":
                            $this->bot->startConversation(
                                new TutorialConversation()
                            );
                            break;
                        case "about":
                            $this->bot->startConversation(
                                new AboutConversation()
                            );
                            break;
                        default:
                            $this->fallback($answer);
                            break;
                    }
                } else {
                    $this->fallback($answer);
                }
            },
            [
                "parse_mode" => "Markdown",
            ]
        );
    }
}
