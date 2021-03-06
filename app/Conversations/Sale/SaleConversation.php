<?php

namespace App\Conversations\Sale;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramPost;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class SaleConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $user = TelegramUser::getUser(
            $this->getBot()
                ->getUser()
                ->getId()
        );
        $posts = TelegramPost::getPosts(
            $this->getBot()
                ->getUser()
                ->getId(),
            1
        );
        $post_enabled_count = TelegramPost::countPost(
            $this->getBot()
                ->getUser()
                ->getId(),
            1
        );
        $post_disabled_count = TelegramPost::countPost(
            $this->getBot()
                ->getUser()
                ->getId(),
            0
        );

        $message = "*💰 Manage Sale*" . PHP_EOL . PHP_EOL;

        $message .= "Here you can manage your Sale Post." . PHP_EOL . PHP_EOL;

        // SALE POST

        $message .= "*Sale Post*" . PHP_EOL;
        $message .= "├ Enabled : `" . $post_enabled_count . "`" . PHP_EOL;
        $message .= "├ Disabled : `" . $post_disabled_count . "`" . PHP_EOL;
        $message .=
            "└ Total : `" .
            ($post_enabled_count + $post_disabled_count) .
            "`" .
            PHP_EOL .
            PHP_EOL;

        $message .=
            "Below is the actual view that will be sent to the group." .
            PHP_EOL .
            PHP_EOL;

        // SALE PREVIEW

        $message .=
            "💰 [" .
            $user->first_name .
            ($user->last_name ? " " . $user->last_name : "") .
            "](tg://user?id=" .
            $user->id .
            ")" .
            ($user->phone ? " (`" . $user->phone . "`)" : "") .
            PHP_EOL;
        if ($posts->isEmpty()) {
            $message .= " └ _(No data)_";
        } else {
            for ($i = 0; $i < $posts->count(); $i++) {
                if ($i + 1 == $posts->count()) {
                    $prefix = " └ ";
                } else {
                    $prefix = " ├ ";
                }
                $message .= $prefix . $posts->get($i)->post . PHP_EOL;
            }
        }

        $question = Question::create($message)->addButtons([
            Button::create("➕ Create New")->value("create"),
            Button::create("⚙️ Enable/Disable")->value("enable_disable"),
            Button::create("✏️ Edit/Delete")->value("edit_delete"),
            Button::create("👈 Back")->value("back"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "create":
                            $this->getBot()->startConversation(
                                new CreateConversation()
                            );
                            break;
                        case "enable_disable":
                            $this->getBot()->startConversation(
                                new EnableDisableConversation()
                            );
                            break;
                        case "edit_delete":
                            $this->getBot()->startConversation(
                                new EditDeleteConversation()
                            );
                            break;
                        case "back":
                            $this->getBot()->startConversation(
                                new StartConversation()
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
