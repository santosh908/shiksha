<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('devotee_registration_rejection', function (Blueprint $table) {
            $table->id();
            $table->integer('rejected_by')->nulable();
            $table->foreignId('profile_id')->constrained('professional_information')->onDelete('cascade');
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devotee_registration_rejection');
    }
};
