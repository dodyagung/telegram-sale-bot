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
        $telegram_group_name = env("TELEGRAM_GROUP_NAME");
        $telegram_group_link = env("TELEGRAM_GROUP_LINK");

        $message = "*🏠 Welcome*" . PHP_EOL . PHP_EOL;
        $message .=
            "I'm a telegram-sale-bot. What can I help you today?" .
            PHP_EOL .
            PHP_EOL;

        $message .= "👥 *SALE GROUP*" . PHP_EOL;
        $message .= " ├ Name : " . $telegram_group_name . PHP_EOL;
        if ($this->is_user_joined_group()) {
            $message .= " ├ Joined : Yes" . PHP_EOL;
        } else {
            $message .= " ├ Joined : No" . PHP_EOL;
        }
        $message .=
            " └ Link : [Click here](" . $telegram_group_link . ")" . PHP_EOL;

        $message .= "👥 *SALE DATE*" . PHP_EOL;
        $message .= " ├ Next sale : " . $telegram_group_name . PHP_EOL;
        if ($this->is_user_joined_group()) {
            $message .= " ├ Joined : Yes" . PHP_EOL;
        } else {
            $message .= " ├ Joined : No" . PHP_EOL;
        }
        $message .=
            " └ Link : [Click here](" . $telegram_group_link . ")" . PHP_EOL;

        $question = Question::create($message)->addButtons([
            Button::create("💰 Manage Sale")->value("sale"),
            Button::create("👤 My Profile")->value("profile"),
            Button::create("❓ Tutorial")->value("tutorial"),
            Button::create("🤖 About")->value("about"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "sale":
                            $this->getBot()->startConversation(
                                new AboutConversation()
                            );
                            break;
                        case "profile":
                            $this->getBot()->startConversation(
                                new ProfileConversation()
                            );
                            break;
                        case "tutorial":
                            $this->getBot()->startConversation(
                                new TutorialConversation()
                            );
                            break;
                        case "about":
                            $this->getBot()->startConversation(
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
