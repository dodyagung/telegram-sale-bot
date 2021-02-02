<?php

namespace App\Conversations;

use App\Conversations\Conversation;
use App\Conversations\Sale\SaleConversation;
use App\TelegramUser;
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
        $user = TelegramUser::saveUser($this->getBot()->getUser());
        $now = Carbon::now();

        $bot_day_sale = Carbon::parse(env("BOT_DAY_SALE"));
        $bot_day_reset = Carbon::parse(env("BOT_DAY_RESET"));

        $telegram_group_name = env("TELEGRAM_GROUP_NAME");
        $telegram_group_link = env("TELEGRAM_GROUP_LINK");

        // WELCOME

        $message = "*🏠 Welcome*" . PHP_EOL . PHP_EOL;
        $message .=
            "Hello " .
            $user->first_name .
            ($user->last_name ? " " . $user->last_name : "") .
            ", I'm [telegram-sale-bot](https://github.com/dodyagung/telegram-sale-bot). It's *" .
            $now->isoFormat("dddd, DD MMMM YYYY - HH:mm z") .
            "*, what can I help you today?" .
            PHP_EOL .
            PHP_EOL;

        // SALE TIME

        $message .= "⏰ *SALE TIME*" . PHP_EOL;
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

        // SALE GROUP

        $message .= "👥 *SALE GROUP*" . PHP_EOL;
        $message .= " ├ Name : " . $telegram_group_name . PHP_EOL;
        $message .=
            " ├ Joined : " .
            ($this->isUserJoinedGroup($user) ? "Yes" : "No") .
            PHP_EOL;
        $message .=
            " └ Link : [Click here](" .
            $telegram_group_link .
            ")" .
            PHP_EOL .
            PHP_EOL;

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
                                new SaleConversation()
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
                "disable_web_page_preview" => true,
            ]
        );
    }
}
