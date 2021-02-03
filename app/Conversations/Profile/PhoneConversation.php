<?php

namespace App\Conversations\Profile;

use App\Conversations\Conversation;
use App\Conversations\StartConversation;
use App\TelegramUser;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class PhoneConversation extends Conversation
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

        $message = "*📱 Edit Phone*" . PHP_EOL . PHP_EOL;

        $message .=
            "Your phone number is *" . $user->phone . "*." . PHP_EOL . PHP_EOL;

        $message .=
            "If you want to delete your phone number, click *Delete*. Otherwise, if you want to change it, *type directly below* :" .
            PHP_EOL .
            PHP_EOL;

        $question = Question::create($message)->addButtons([
            Button::create("❌ Delete")->value("profile_phone_delete"),
            Button::create("👈 Back")->value("back"),
        ]);

        return $this->ask(
            $question,
            function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    switch ($answer->getValue()) {
                        case "back":
                            $this->getBot()->startConversation(
                                new ProfileConversation()
                            );
                            break;
                        case "profile_phone_delete":
                            TelegramUser::deletePhone(
                                $this->getBot()
                                    ->getUser()
                                    ->getId()
                            );
                            $this->getBot()->startConversation(
                                new ProfileConversation()
                            );
                            break;
                        default:
                            $this->fallback($answer);
                            break;
                    }
                } else {
                    TelegramUser::updatePhone(
                        $this->getBot()
                            ->getUser()
                            ->getId(),
                        $answer->getText()
                    );
                    $this->getBot()->startConversation(
                        new ProfileConversation()
                    );
                }
            },
            [
                "parse_mode" => "Markdown",
            ]
        );
    }
}
