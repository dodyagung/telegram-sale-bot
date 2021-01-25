<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelegramUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("telegram_users", function (Blueprint $table) {
            $table->bigInteger("id");
            $table->primary("id");

            $table->string("username")->nullable();
            $table->string("first_name");
            $table->string("last_name")->nullable();
            $table->string("phone")->nullable();

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
        Schema::dropIfExists("telegram_users");
    }
}
