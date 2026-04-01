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
        Schema::create('prayer', function (Blueprint $table) {
            $table->id();
            $table->string('prayer_name_english');
            $table->string('prayer_name_hindi')->default('');
            $table->string('is_active')->default('Y');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prayer');
    }
};
