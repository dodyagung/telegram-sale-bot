<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use Carbon\Carbon;

class StartConversation extends Conversation
{
    /**
     * Place your conversation logic here.
     */
    public function askConversation()
    {
        $now = Carbon::now();

        $bot_day_sale = Carbon::parse(env("BOT_DAY_SALE"));
        $bot_day_reset = Carbon::parse(env("BOT_DAY_RESET"));

        $telegram_group_name = env("TELEGRAM_GROUP_NAME");
        $telegram_group_link = env("TELEGRAM_GROUP_LINK");

        $this->saveUserToDB();

        // WELCOME

        $message = "*🏠 Welcome*" . PHP_EOL . PHP_EOL;
        $message .=
            "I'm a telegram-sale-bot. What can I help you today?" .
            PHP_EOL .
            PHP_EOL;

        // SALE GROUP

        $message .= "👥 *SALE GROUP*" . PHP_EOL;
        $message .= " ├ Name : " . $telegram_group_name . PHP_EOL;
        if ($this->isUserJoinedGroup()) {
            $message .= " ├ Joined : Yes" . PHP_EOL;
        } else {
            $message .= " ├ Joined : No" . PHP_EOL;
        }
        $message .=
            " └ Link : [Click here](" .
            $telegram_group_link .
            ")" .
            PHP_EOL .
            PHP_EOL;

        // SALE TIME

        $message .= "⏰ *SALE TIME*" . PHP_EOL;
        $message .=
            " ├ Today : " .
            $now->isoFormat("dddd, DD MMMM YYYY - HH:mm z") .
            PHP_EOL;
        $message .=
            " ├ Sale Day : " .
            $bot_day_sale->isoFormat("dddd, DD MMMM YYYY") .
            PHP_EOL;
        $message .=
            " ├ Reset Day : " .
            $bot_day_reset->isoFormat("dddd, DD MMMM YYYY") .
            PHP_EOL;
        $message .=
            " └ Timezone : " . $now->isoFormat("zz (Z)") . PHP_EOL . PHP_EOL;

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
