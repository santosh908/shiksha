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
        Schema::create('shiksha__lavel__master', function (Blueprint $table) {
            $table->id();
            $table->string('Lavel_Name')->nullable(true);
            $table->string('Lavel_Name_Description')->nullable(true);
            $table->string('IsActive')->default('Y');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shiksha__lavel__master');
    }
};
