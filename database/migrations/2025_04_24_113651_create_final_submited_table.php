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
        Schema::create('final_submited', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // example field
            $table->Integer('exam_id'); // example field
            $table->boolean('is_submitted')->default(true); // example field
            $table->timestamps();
            // Foreign key constraint (optional)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('final_submited');
    }
};
