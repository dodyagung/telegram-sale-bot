<?php

namespace App\Conversations\Profile;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class ProfileConversation extends Conversation
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

        $message = "*👤 My Profile*" . PHP_EOL . PHP_EOL;

        $message .=
            "This is your account information. You can also edit, enable or disable your phone below." .
            PHP_EOL .
            PHP_EOL;

        $message .= "*Telegram Info*" . PHP_EOL;
        $message .= "├ ID : `" . $user->id . "`" . PHP_EOL;
        $message .=
            "├ Username : `" . ($user->username ?? "<not set>") . "`" . PHP_EOL;
        $message .= "├ First Name : `" . $user->first_name . "`" . PHP_EOL;
        $message .=
            "└ Last Name : `" .
            ($user->last_name ?? "<not set>") .
            "`" .
            PHP_EOL .
            PHP_EOL;

        $message .= "*Additional Info*" . PHP_EOL;
        $message .=
            "└ Phone : `" . ($user->phone ?? "<not set>") . "`" . PHP_EOL;

        $question = Question::create($message)->addButtons([
            Button::create("📱 Edit Phone")->value("profile_phhone"),
            Button::create("👈 Back")->value("start"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "start":
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
