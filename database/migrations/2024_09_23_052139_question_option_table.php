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

        Schema::create('question_option_table', function (Blueprint $table) {
            $table->id(); // Primary key (ID)
            //$table->foreignId('question_id')->unique()->constrained('questionbanks')->onDelete('cascade');
            $table->integer('option_sequence'); // Option sequence should be an integer and unique
            $table->string('option'); // Option text  S
            $table->boolean('is_answer'); // Boolean for correct answer (true/false)
            $table->text('answer_explanation')->nullable(); // Explanation can be null
            $table->boolean('is_active')->default(true); // Boolean for active status (default: true)
            $table->timestamps(); // Timestamps
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_option_table');
    }
};
