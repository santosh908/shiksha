<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('examinations', function (Blueprint $table) {
            $table->id();
            $table->string('exam_session');
            $table->string('exam_level');
            $table->string('remarks')->nullable();
            $table->date('date');
            $table->time('start_time');
            $table->unsignedInteger('duration');
            $table->integer('no_of_question');
            $table->integer('total_marks');
            $table->integer('qualifying_marks');
            $table->string('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examinations');
    }
};
