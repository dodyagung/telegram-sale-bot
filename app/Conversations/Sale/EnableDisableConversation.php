<?php

namespace App\Conversations\Sale;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramPost;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class EnableDisableConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $posts = TelegramPost::getPosts(
            $this->getBot()
                ->getUser()
                ->getId()
        );

        $message = "*⚙️ Enable/Disable*" . PHP_EOL . PHP_EOL;

        $message .= "Choose your sale post below to enable or disable it :";

        $buttons = [];
        foreach ($posts as $key => $value) {
            $buttons[] = Button::create(
                ($value->status == 1 ? "✅ " : "❌ ") . $value->post
            )->value($value->id);
        }
        $buttons[] = Button::create("👈 Back")->value("back");

        $question = Question::create($message)->addButtons($buttons);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "back":
                            $this->getBot()->startConversation(
                                new SaleConversation()
                            );
                            break;
                        default:
                            TelegramPost::toggleStatusPost($answer->getValue());
                            $this->getBot()->startConversation(
                                new EnableDisableConversation()
                            );
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
