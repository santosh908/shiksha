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
        Schema::create('devotee_book', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('professional_information')->onDelete('cascade');
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->string('is_active')->default('Y');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devotee_book');
    }
};
