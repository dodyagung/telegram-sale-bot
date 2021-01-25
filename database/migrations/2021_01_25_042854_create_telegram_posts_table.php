<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelegramPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("telegram_posts", function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->bigInteger("telegram_user_id");
            $table
                ->foreign("telegram_user_id")
                ->references("id")
                ->on("telegram_users");

            $table->boolean("active")->default(0);
            $table->string("post", 16000);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("telegram_posts");
    }
}
