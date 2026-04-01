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
        Schema::create('state', function (Blueprint $table) {
            $table->id();
            $table->string('lg_code');
            $table->string('state_code');
            $table->string('state_name');
            $table->string('is_active')->default('Y');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('state');
    }
};
