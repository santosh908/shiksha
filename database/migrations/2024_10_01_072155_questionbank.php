<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questionbank', function (Blueprint $table) {
            $table->id();
            $table->string('question_english');
            $table->string('question_hindi');
            $table->string('subject');
            $table->string('chapter');
            $table->string('level');
            $table->string('difficulty_label');
            $table->string('option1');
            $table->string('option2');
            $table->string('option3');
            $table->string('option4');
            $table->string('correctanswer');
            $table->string('any_remark')->nullable();
            $table->string('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionbank');
    }
};
