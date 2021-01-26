<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation as BaseConversation;
use BotMan\BotMan\Messages\Incoming\Answer;

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
    protected function is_user_joined_group()
    {
        $is_user_joined_group = false;

        if ($this->getBot()->getDriver() == "telegram") {
            $user = $this->getBot()->getUser();

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
}
