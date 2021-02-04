<?php

namespace App\Conversations\Sale;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramPost;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class CreateConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $message = "*💰 Create New*" . PHP_EOL . PHP_EOL;

        $message .= "Type your new sale post directly below :";

        $question = Question::create($message)->addButtons([
            Button::create("👈 Back")->value("back"),
        ]);

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
                            $this->fallback($answer);
                            break;
                    }
                } else {
                    TelegramPost::createPost(
                        $this->getBot()
                            ->getUser()
                            ->getId(),
                        $answer->getText()
                    );
                    $this->getBot()->startConversation(new SaleConversation());
                }
            },
            [
                "parse_mode" => "Markdown",
            ]
        );
    }
}
