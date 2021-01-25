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
        $user = $this->getBot()->getUser();

        $message = "*🏠 Welcome*" . PHP_EOL . PHP_EOL;
        $message .= "I'm a telegram-sale-bot. What can I help you today?";

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

    private function is_user_joined_group()
    {
        $user = $this->getBot()->getUser();

        $request = $this->getBot()->sendRequest("getChatMember", [
            "chat_id" => env("TELEGRAM_GROUP_ID"),
            "user_id" => $user->getId(),
        ]);

        $is_user_joined_group = false;
        if ($request->getStatusCode() == 200) {
            if (
                in_array(json_decode($request->getContent())->result->status, [
                    "creator",
                    "administrator",
                    "member",
                ])
            ) {
                $user_joined_group = true;
            }
        }

        return $is_user_joined_group;
    }
}
