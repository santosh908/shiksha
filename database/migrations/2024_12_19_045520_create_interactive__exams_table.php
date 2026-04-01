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
        Schema::create('submited_exam', function (Blueprint $table) {
            $table->id(); // Primary key with auto-increment
            $table->bigInteger('user_id')->nullable(0);
            $table->bigInteger('session_id')->default(0); 
            $table->bigInteger('exam_id')->nullable(0);
            $table->bigInteger('question_id')->nullable(0);
            $table->string('selected_answer')->nullable(); 
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submited_exam');
    }
};
