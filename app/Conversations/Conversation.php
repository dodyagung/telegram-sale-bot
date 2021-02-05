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
        if ($answer->getText() == config("command_start")) {
            $this->getBot()->startConversation(new StartConversation());
        } else {
            $this->say(config("command_fallback"));
        }
    }

    /**
     * If user is member of the group?
     */
    protected function isUserJoinedGroup($user)
    {
        $is_user_joined_group = false;

        $request = $this->getBot()->sendRequest("getChatMember", [
            "chat_id" => config("group_id"),
            "user_id" => $user->id,
        ]);

        if ($request->getStatusCode() == 200) {
            if (
                in_array(json_decode($request->getContent())->result->status, [
                    "creator",
                    "administrator",
                    "member",
                ])
            ) {
                $is_user_joined_group = true;
            }
        }

        return $is_user_joined_group;
    }
}
