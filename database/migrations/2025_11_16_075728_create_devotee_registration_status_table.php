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
        Schema::create('devotee_registration_status', function (Blueprint $table) {
            $table->id();
            $table->date('registration_start_date');
            $table->date('registration_end_date');
            $table->enum('is_open', ['Open', 'Close'])->default('Close');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devotee_registration_status');
    }
};
