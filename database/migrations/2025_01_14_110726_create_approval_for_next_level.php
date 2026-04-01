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
        Schema::create('approval_for_next_level', function (Blueprint $table) {
            $table->id();
            $table->string('login_id')->default(0);
            $table->bigInteger('exam_id')->default(0);
            $table->bigInteger('shiksha_level')->default(0);
            $table->bigInteger('IsAllowed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_for_next_level');
    }
};
