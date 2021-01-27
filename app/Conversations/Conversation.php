<?php

namespace App\Conversations;

use App\TelegramUser;
use BotMan\BotMan\Messages\Conversations\Conversation as BaseConversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use Carbon\Carbon;

class Conversation extends BaseConversation
{
    /**
     * Start the conversation
     */
    public function run()
    {
        $this->askConversation();
    }

    /**
     * Handle the fallback
     */
    public function fallback(Answer $answer)
    {
        if ($answer->getText() == env("BOT_COMMAND_START")) {
            $this->getBot()->startConversation(new StartConversation());
        } else {
            $this->say(env("BOT_COMMAND_FALLBACK"));
        }
    }

    /**
     * If user is member of the group?
     */
    protected function isUserJoinedGroup()
    {
        $is_user_joined_group = false;

        if ($this->getBot()->getDriver() == "telegram") {
            $user = $this->get_user();

            $request = $this->getBot()->sendRequest("getChatMember", [
                "chat_id" => env("TELEGRAM_GROUP_ID"),
                "user_id" => $user->getId(),
            ]);

            if ($request->getStatusCode() == 200) {
                if (
                    in_array(
                        json_decode($request->getContent())->result->status,
                        ["creator", "administrator", "member"]
                    )
                ) {
                    $is_user_joined_group = true;
                }
            }
        }

        return $is_user_joined_group;
    }

    /**
     * If user is member of the group?
     */
    protected function saveUserToDB()
    {
        $user = $this->getBot()->getUser();

        $result = TelegramUser::updateOrCreate(
            ["id" => $user->getId()],
            [
                "username" => $user->getUsername(),
                "first_name" => $user->getFirstName(),
                "last_name" => $user->getLastName(),
                "updated_at" => Carbon::now(),
            ]
        );
    }
}
