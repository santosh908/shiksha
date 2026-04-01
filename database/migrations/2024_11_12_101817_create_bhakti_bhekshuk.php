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
        Schema::create('bhakti_bhekshuk', function (Blueprint $table) {
            $table->id();
            $table->string('bhakti_bhikshuk_name');
            $table->string('ashray_leader_code');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('is_active')->default('Y');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bhakti_bhekshuk');
    }
};
