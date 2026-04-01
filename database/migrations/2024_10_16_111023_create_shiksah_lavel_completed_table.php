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
        Schema::create('shiksah_lavel_completed', function (Blueprint $table) {
            $table->id();
            $table->string('login_id')->nullable(); // Removed unique
            $table->integer('shiksha_level')->unsigned()->nullable(); // Corrected column name
            $table->string('exam_date')->nullable(); // Corrected column name
            $table->integer('total_questions')->unsigned()->nullable(); // Corrected column name
            $table->decimal('total_marks',8, 2)->unsigned()->nullable(); // Corrected column name
            $table->decimal('total_obtain',8, 2)->unsigned()->nullable(); // Corrected column name
            $table->string('is_qualified')->default('N'); // Corrected column name
            $table->string('certificate_issued')->default('N'); // Corrected column name
            $table->string('certificate_path')->nullable(); // Corrected
            $table->string('is_promoted_by_ashray_leader')->default('N'); // Corrected column name
            $table->string('ashray_leader_code')->nullable(); // Corrected column name
            $table->string('certificate_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shiksah_lavel_completed');
    }
};
