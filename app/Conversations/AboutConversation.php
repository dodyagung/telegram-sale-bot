<?php

namespace App\Conversations;

use App\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class AboutConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $message = "*🤖 About*" . PHP_EOL . PHP_EOL;

        $message .= "*telegram-sale-bot*" . PHP_EOL;
        $message .=
            "I'm a bot to automate your scheduled-sale in Telegram group." .
            PHP_EOL;
        $message .=
            "Open-sourced at [GitHub](https://github.com/dodyagung/telegram-sale-bot). Built with [BotMan](https://botman.io) and [Laravel](https://laravel.com). " .
            PHP_EOL;
        $message .= "Made with ♥ in Jakarta, Indonesia." . PHP_EOL . PHP_EOL;
        $message .= "*Contact Us*" . PHP_EOL;
        $message .=
            "Found an error? Have a question? Open a [GitHub Issues](https://github.com/dodyagung/telegram-sale-bot/issues)." .
            PHP_EOL .
            PHP_EOL;
        $message .= "*Contribute*" . PHP_EOL;
        $message .=
            "If you are developer, open a [GitHub Pull Request](https://github.com/dodyagung/telegram-sale-bot/pulls)." .
            PHP_EOL .
            PHP_EOL;
        $message .= "*Creator*" . PHP_EOL;
        $message .=
            "Hi, I am Dody Agung Saputro. I make the WWW fun." . PHP_EOL;
        $message .=
            "Visit my website at [www.dodyagung.com](https://www.dodyagung.com)." .
            PHP_EOL .
            PHP_EOL;
        $message .= "*License*" . PHP_EOL;
        $message .=
            "This open-source project is licensed under [MIT license](https://github.com/dodyagung/telegram-sale-bot/blob/master/LICENSE.md).";

        $question = Question::create($message)->addButtons([
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
                "disable_web_page_preview" => true,
            ]
        );
    }
}
