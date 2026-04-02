<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Ensures one final_submited row per user per exam so concurrent finalize cannot create duplicates.
     */
    public function up(): void
    {
        Schema::table('final_submited', function (Blueprint $table) {
            $table->unique(['user_id', 'exam_id'], 'final_submited_user_exam_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('final_submited', function (Blueprint $table) {
            $table->dropUnique('final_submited_user_exam_unique');
        });
    }
};
