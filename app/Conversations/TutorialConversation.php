<?php

namespace App\Conversations;

use App\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class TutorialConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $message = "*❓ Tutorial*" . PHP_EOL . PHP_EOL;

        $message .=
            "1. If you've never used this bot before, add a new Sale Post in *Manage Sale > Create New*." .
            PHP_EOL;
        $message .=
            "2. If you've used this bot before, re-activate your old Sale Post in *Manage Sale > Active/Deactive*. You can also Edit and Delete your Sale Post in *Manage Sale > Edit/Delete*." .
            PHP_EOL;
        $message .=
            "3. Sale Post that has passed the Sell Day will become disabled automatically." .
            PHP_EOL;
        $message .= "4. Only enabled Sale Post is sent to the group." . PHP_EOL;
        $message .=
            "5. The actual view that will be sent to the group can be seen in *Manage Sale*." .
            PHP_EOL;
        $message .=
            "6. If there are problems or errors, contact us on the About menu.";

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
