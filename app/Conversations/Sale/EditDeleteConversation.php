<?php

namespace App\Conversations\Sale;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramPost;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class EditDeleteConversation extends Conversation
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

        $message = "*✏️ Edit/Delete*" . PHP_EOL . PHP_EOL;

        $message .= "Choose your sale post below to edit or delete it :";

        $buttons = [];
        foreach ($posts as $key => $value) {
            $buttons[] = Button::create($value->post)->value($value->id);
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
                            $this->editOrDelete($answer->getValue());
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

    public function editOrDelete($id)
    {
        $post = TelegramPost::getPost($id);

        $message = "*✏️ Edit/Delete*" . PHP_EOL . PHP_EOL;

        $message .= "Your sale post is :" . PHP_EOL;
        $message .= "`" . $post->post . "`" . PHP_EOL . PHP_EOL;

        $message .=
            "If you want to delete your sale post, click *Delete*. Otherwise, if you want to edit it, *type directly below* :" .
            PHP_EOL .
            PHP_EOL;

        $question = Question::create($message)->addButtons([
            Button::create("❌ Delete")->value("delete"),
            Button::create("👈 Back")->value("back"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) use ($post) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "delete":
                            TelegramPost::deletePost($post->id);
                            $this->getBot()->startConversation(
                                new EditDeleteConversation()
                            );
                            break;
                        case "back":
                            $this->getBot()->startConversation(
                                new EditDeleteConversation()
                            );
                            break;
                        default:
                            $this->fallback($answer);
                            break;
                    }
                } else {
                    TelegramPost::editPost($post->id, $answer->getText());
                    $this->editOrDelete($post->id);
                }
            },
            [
                "parse_mode" => "Markdown",
            ]
        );
    }
}
